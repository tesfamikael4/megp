import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  PostBudgetPlan,
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PostBudgetPlanTimeline,
  PreBudgetPlan,
  PreBudgetPlanActivity,
  PreBudgetPlanItems,
} from 'src/entities';
import { DataResponseFormat } from 'src/shared/api-data';
import { PostBudgetPlanService } from 'src/modules/post-budget-plan/services/post-budget-plan.service';
import { PostBudgetPlanActivityService } from 'src/modules/post-budget-plan/services/post-budget-plan-activity.service';
import { PostBudgetPlanItemService } from 'src/modules/post-budget-plan/services/post-budget-plan-items.service';
import {
  CollectionQuery,
  QueryConstructor,
  FilterOperators,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { PostBudgetPlanTimelineService } from 'src/modules/post-budget-plan/services/post-budget-plan-timeline.service';
import { PostBudgetRequisitionerService } from 'src/modules/post-budget-plan/services/post-budget-requisitioner.service';
import { PostProcurementMechanismService } from 'src/modules/post-budget-plan/services/post-procurement-mechanism.service';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { PostBudgetRequisitioner } from 'src/entities/post-budget-plan-requisitioner.entity';
import { PostProcurementMechanism } from 'src/entities/post-procurement-mechanism.entity';
import { ExtraCrudService } from 'src/shared/service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PreBudgetPlanService extends ExtraCrudService<PreBudgetPlan> {
  constructor(
    @InjectRepository(PreBudgetPlan)
    private readonly repositoryPreBudgetPlan: Repository<PreBudgetPlan>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly preBudgetActivityRepository: Repository<PreBudgetPlanActivity>,
    @InjectRepository(PreBudgetPlanItems)
    private readonly preBudgetItemsRepository: Repository<PreBudgetPlanItems>,

    private eventEmitter: EventEmitter2,
    @Inject('PLANNING_RMQ_SERVICE')
    private readonly planningRMQClient: ClientProxy,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryPreBudgetPlan);
    planningRMQClient.connect();
  }

  async create(itemData: PreBudgetPlan): Promise<PreBudgetPlan> {
    const item = this.repositoryPreBudgetPlan.create(itemData);
    await this.repositoryPreBudgetPlan.insert(item);
    return item;
  }

  async findPreBudgetPlans(organizationId: string, q: string) {
    const query = decodeCollectionQuery(q);

    query.includes.push('app');
    query.where.push([
      {
        column: 'organizationId',
        value: organizationId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<PreBudgetPlan>(
      this.repositoryPreBudgetPlan,
      query,
    );

    const response = new DataResponseFormat<PreBudgetPlan>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async getAnalytics(preBudgetPlanId: string): Promise<{
    totalActivities: number;
    currencyTotalAmounts: Record<string, number>;
    targetGroupPercentages: Record<string, number>;
  }> {
    const preBudgetPlan = await this.repositoryPreBudgetPlan.findOne({
      where: { id: preBudgetPlanId },
      relations: [
        'preBudgetPlanActivities',
        'preBudgetPlanActivities.preBudgetPlanItems',
      ],
    });

    if (!preBudgetPlan) {
      throw new Error(`PreBudgetPlan with ID ${preBudgetPlanId} not found`);
    }
    const currencyTotalAmounts: Record<string, number> = {};
    let totalAmount = 0;
    const totalActivities = preBudgetPlan.preBudgetPlanActivities.length;

    preBudgetPlan.preBudgetPlanActivities.forEach((activity) => {
      activity.preBudgetPlanItems.forEach((item) => {
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
      await this.calculateTargetGroupPercentage(preBudgetPlanId);
    return { totalActivities, currencyTotalAmounts, targetGroupPercentages };
  }

  async calculateTargetGroupPercentage(
    preBudgetPlanId: string,
  ): Promise<Record<string, number>> {
    const preBudgetPlan = await this.repositoryPreBudgetPlan.findOne({
      where: { id: preBudgetPlanId },
      relations: [
        'preBudgetPlanActivities',
        'preBudgetPlanActivities.preProcurementMechanisms',
      ],
    });

    if (!preBudgetPlan) {
      throw new Error(`PreBudgetPlan with ID ${preBudgetPlanId} not found`);
    }

    const targetGroupCounts: Record<string, number> = {};

    preBudgetPlan.preBudgetPlanActivities.forEach((activity) => {
      activity.preProcurementMechanisms.forEach((mechanism) => {
        const targetGroups = mechanism.targetGroup || [];

        targetGroups.forEach((group) => {
          targetGroupCounts[group] = (targetGroupCounts[group] || 0) + 1;
        });
      });
    });

    const totalMechanisms = preBudgetPlan.preBudgetPlanActivities.reduce(
      (total, activity) => total + activity.preProcurementMechanisms.length,
      0,
    );

    const targetGroupPercentages: Record<string, number> = {};

    for (const group in targetGroupCounts) {
      const percentage = (targetGroupCounts[group] / totalMechanisms) * 100;
      targetGroupPercentages[group] = percentage;
    }

    return targetGroupPercentages;
  }
  async copySelectedPreToPost(data: any): Promise<void> {
    try {
      const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
      const sourceEntity = await this.repositoryPreBudgetPlan.findOneOrFail({
        where: { id: data.itemId },
      });

      await entityManager.getRepository(PreBudgetPlan).update(sourceEntity.id, {
        status: 'Approved',
      });

      const activities = await this.preBudgetActivityRepository.find({
        where: { preBudgetPlanId: data },
        relations: [
          'preBudgetPlanItems',
          'preBudgetPlanTimelines',
          'preBudgetRequisitioners',
          'preProcurementMechanisms',
        ],
      });

      const postBudget = {
        ...sourceEntity,
        status: 'Draft',
        preBudgetPlanId: data,
        id: undefined,
      };
      await entityManager
        .getRepository(PostBudgetPlan)
        .insert(postBudget as any);

      const act: any = activities.map((activity) => ({
        ...activity,
        postBudgetPlanId: postBudget.id,
      }));

      await entityManager.getRepository(PostBudgetPlanActivity).insert(act);

      for (const element of act) {
        try {
          const item = element.preBudgetPlanItems.map((item) => ({
            ...item,
            postBudgetPlanActivityId: element.id,
            id: undefined,
          }));
          await entityManager
            .getRepository(PostBudgetPlanItem)
            .insert(item as any);

          if (element.preBudgetPlanTimelines.length == 0) {
            throw new Error(
              `Timeline not found for ${element.name} ${element.procurementReference}`,
            );
          }

          const time = element.preBudgetPlanTimelines.map((item) => ({
            ...item,
            postBudgetPlanActivityId: element.id,
            id: undefined,
          }));
          await entityManager
            .getRepository(PostBudgetPlanTimeline)
            .insert(time as any);

          const requisitioner = element.preBudgetRequisitioners.map((item) => ({
            ...item,
            postBudgetPlanActivityId: element.id,
            id: undefined,
          }));
          await entityManager
            .getRepository(PostBudgetRequisitioner)
            .insert(requisitioner as any);

          const mechanism = element.preProcurementMechanisms?.map((item) => ({
            ...item,
            postBudgetPlanActivityId: element.id,
            id: undefined,
          }));
          await entityManager
            .getRepository(PostProcurementMechanism)
            .insert(mechanism as any);
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async initiateWorkflow(name, id) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const activities = await this.preBudgetActivityRepository.find({
      where: { preBudgetPlanId: id },
      relations: ['preBudgetPlanTimelines'],
    });

    for (const element of activities) {
      if (element.preBudgetPlanTimelines.length == 0) {
        throw new Error(
          `Timeline not found for ${element.name} ${element.procurementReference}`,
        );
      }
    }

    await entityManager.getRepository(PreBudgetPlan).update(id, {
      status: 'Submitted',
    });
    await this.planningRMQClient.emit('initiate-workflow', {
      name: name,
      id: id,
    });
  }
}
