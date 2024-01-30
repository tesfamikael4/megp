import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { PostBudgetPlan } from 'src/entities/post-budget-plan.entity';
import {
  FilterOperators,
  QueryConstructor,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { ExtraCrudService } from 'src/shared/service';
import { PostBudgetPlanActivity } from 'src/entities';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PostBudgetPlanService extends ExtraCrudService<PostBudgetPlan> {
  constructor(
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,

    @InjectRepository(PostBudgetPlanActivity)
    private readonly postBudgetActivityRepository: Repository<PostBudgetPlanActivity>,

    @Inject('PLANNING_RMQ_SERVICE')
    private readonly planningRMQClient: ClientProxy,

    @Inject(REQUEST)
    private readonly request: Request,

    private dataSource: DataSource,
  ) {
    super(repositoryPostBudgetPlan);
  }
  async findPostBudgetPlans(organizationId: string, q: string) {
    const query = decodeCollectionQuery(q);
    query.where.push([
      {
        column: 'organizationId',
        value: organizationId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.includes.push('preBudgetPlan');
    query.includes.push('app');
    const dataQuery = QueryConstructor.constructQuery<PostBudgetPlan>(
      this.repositoryPostBudgetPlan,
      query,
    );
    const response = new DataResponseFormat<PostBudgetPlan>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
  async getAnalytics(postBudgetPlanId: string): Promise<{
    totalActivities: number;
    currencyTotalAmounts: Record<string, number>;
    targetGroupPercentages: Record<string, number>;
  }> {
    const postBudgetPlan = await this.repositoryPostBudgetPlan.findOne({
      where: { id: postBudgetPlanId },
      relations: [
        'postBudgetPlanActivities',
        'postBudgetPlanActivities.postBudgetPlanItems',
      ],
    });

    if (!postBudgetPlan) {
      throw new NotFoundException(`PostBudgetPlan not found`);
    }
    const currencyTotalAmounts: Record<string, number> = {};
    let totalAmount = 0;
    const totalActivities = postBudgetPlan.postBudgetPlanActivities.length;

    postBudgetPlan.postBudgetPlanActivities.forEach((activity) => {
      activity.postBudgetPlanItems.forEach((item) => {
        const itemTotalAmount = item.quantity * item.unitPrice;
        totalAmount += itemTotalAmount;

        const currency = item.currency;

        if (currencyTotalAmounts[currency]) {
          currencyTotalAmounts[currency] += itemTotalAmount;
        } else {
          currencyTotalAmounts[currency] = itemTotalAmount;
        }
      });
    });
    const targetGroupPercentages: Record<string, number> =
      await this.calculateTargetGroupPercentage(postBudgetPlanId);
    return { totalActivities, currencyTotalAmounts, targetGroupPercentages };
  }

  async calculateTargetGroupPercentage(
    postBudgetPlanId: string,
  ): Promise<Record<string, number>> {
    const postBudgetPlan = await this.repositoryPostBudgetPlan.findOne({
      where: { id: postBudgetPlanId },
      relations: [
        'postBudgetPlanActivities',
        'postBudgetPlanActivities.postProcurementMechanisms',
      ],
    });

    if (!postBudgetPlan) {
      throw new NotFoundException(`PostBudgetPlan not found`);
    }

    const targetGroupCounts: Record<string, number> = {};

    postBudgetPlan.postBudgetPlanActivities.forEach((activity) => {
      activity.postProcurementMechanisms.forEach((mechanism) => {
        const targetGroups = mechanism.targetGroup || [];

        targetGroups.forEach((group) => {
          targetGroupCounts[group] = (targetGroupCounts[group] || 0) + 1;
        });
      });
    });

    const totalMechanisms = postBudgetPlan.postBudgetPlanActivities.reduce(
      (total, activity) => total + activity.postProcurementMechanisms.length,
      0,
    );

    const targetGroupPercentages: Record<string, number> = {};

    for (const group in targetGroupCounts) {
      const percentage = (targetGroupCounts[group] / totalMechanisms) * 100;
      targetGroupPercentages[group] = parseFloat(percentage.toFixed(2));
    }

    return targetGroupPercentages;
  }

  async initiateWorkflow(data) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const activities = await this.postBudgetActivityRepository.find({
      where: { postBudgetPlanId: data.id },
      relations: ['postBudgetPlanTimelines'],
    });

    for (const element of activities) {
      if (element.postBudgetPlanTimelines.length == 0) {
        throw new HttpException(
          `Timeline not found for ${element.name} ${element.procurementReference}`,
          430,
        );
      }
    }

    await entityManager.getRepository(PostBudgetPlan).update(data.id, {
      status: 'Submitted',
    });
    await this.planningRMQClient.emit('initiate-workflow', {
      name: data.name,
      id: data.id,
      itemName: data.itemName,
      organizationId: data.organizationId,
    });
  }

  async copySelectedPreToPost(data: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sourceEntity = await this.repositoryPostBudgetPlan.findOneOrFail({
        where: { id: data.itemId },
      });

      //check Approval status and update the postBudgetPlan
      queryRunner.manager.connection.transaction(async (entityManager) => {
        await entityManager
          .getRepository(PostBudgetPlan)
          .update(sourceEntity.id, {
            status: data.status == 'Rejected' ? 'Draft' : 'Approved',
          });

        //If the status is Approved send event to PR
        if (data.status == 'Approved') {
          const activities = await this.postBudgetActivityRepository.find({
            where: { postBudgetPlanId: data.itemId },
            relations: {
              postBudgetPlanItems: true,
              postBudgetPlanTimelines: true,
              postBudgetRequisitioners: true,
              postProcurementMechanisms: true,
              postBudgePlantDisbursements: true,
            },
          });

          //TODO: do I need to exclude Audits?

          //TODO: why not just send the id of the postBudgetPlan on the event
          //TODO: get the entity needed for the preBudgetPlan with API call
        }
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
