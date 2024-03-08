import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import {
  QueryConstructor,
  FilterOperators,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { PostBudgetRequisitioner } from 'src/entities/post-budget-plan-requisitioner.entity';
import { PostProcurementMechanism } from 'src/entities/post-procurement-mechanism.entity';
import { ExtraCrudService } from 'src/shared/service';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { createHash } from 'crypto';
import { PdfGeneratorService } from 'src/modules/utility/services/pdf-generator.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { DocumentService } from 'src/modules/utility/services/document.service';

@Injectable()
export class PreBudgetPlanService extends ExtraCrudService<PreBudgetPlan> {
  constructor(
    @InjectRepository(PreBudgetPlan)
    private readonly repositoryPreBudgetPlan: Repository<PreBudgetPlan>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly preBudgetActivityRepository: Repository<PreBudgetPlanActivity>,
    @InjectRepository(PreBudgetPlanItems)
    private readonly preBudgetItemsRepository: Repository<PreBudgetPlanItems>,

    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly documentService: DocumentService,

    private readonly minIoService: MinIOService,

    // private eventEmitter: EventEmitter2,
    @Inject('PLANNING_RMQ_SERVICE')
    private readonly planningRMQClient: ClientProxy,

    @Inject(REQUEST)
    private readonly request: Request,

    private dataSource: DataSource,
  ) {
    super(repositoryPreBudgetPlan);
    planningRMQClient.connect();
  }
  private readonly CHUNK_SIZE = 4096;

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
      throw new NotFoundException(`PreBudgetPlan not found`);
    }
    const currencyTotalAmounts: Record<string, number> = {};

    const totalActivities = preBudgetPlan.preBudgetPlanActivities.length;

    preBudgetPlan.preBudgetPlanActivities.forEach((activity) => {
      const currency = activity.currency;

      if (currencyTotalAmounts[currency]) {
        currencyTotalAmounts[currency] += +activity.estimatedAmount;
      } else {
        currencyTotalAmounts[currency] = +activity.estimatedAmount;
      }
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
      throw new NotFoundException(`PreBudgetPlan not found`);
    }

    const targetGroupCounts: Record<string, number> = {};

    preBudgetPlan.preBudgetPlanActivities.forEach((activity) => {
      activity.preProcurementMechanisms.forEach((mechanism) => {
        const targetGroups = mechanism.targetGroup || [];
        let msme = false;

        targetGroups.forEach((group) => {
          const validGroups = [
            'Small Enterprises',
            'Micro Enterprises',
            'Medium Enterprises',
          ];
          const target = validGroups.includes(group);
          if (target && !msme) {
            targetGroupCounts['MSM Enterprises'] =
              (targetGroupCounts['MSM Enterprises'] || 0) +
              +activity.estimatedAmount;
            msme = true;
          } else if (!target) {
            targetGroupCounts[group] =
              (targetGroupCounts[group] || 0) + +activity.estimatedAmount;
          }
        });
      });
    });

    const totalMechanisms = preBudgetPlan.preBudgetPlanActivities.reduce(
      (total, activity) => total + +activity.estimatedAmount,
      0,
    );

    const targetGroupPercentages: Record<string, number> = {};

    for (const group in targetGroupCounts) {
      const percentage = (targetGroupCounts[group] / totalMechanisms) * 100;
      targetGroupPercentages[group] = parseFloat(percentage.toFixed(2));
    }

    return targetGroupPercentages;
  }

  async copySelectedPreToPost(data: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sourceEntity = await this.repositoryPreBudgetPlan.findOneOrFail({
        where: { id: data.itemId },
      });
      queryRunner.manager.connection.transaction(async (entityManager) => {
        await entityManager
          .getRepository(PreBudgetPlan)
          .update(sourceEntity.id, {
            status: data.status == 'Rejected' ? 'Draft' : 'Approved',
          });

        if (data.status == 'Approved') {
          const activities = await this.preBudgetActivityRepository.find({
            where: { preBudgetPlanId: data.itemId },
            relations: [
              'preBudgetPlanItems',
              'preBudgetPlanTimelines',
              'preBudgetRequisitioners',
              'preProcurementMechanisms',
            ],
          });

          if (activities.length == 0) {
            throw new HttpException(`Activity not found `, 430);
          }

          const postBudget = {
            ...sourceEntity,
            status: 'Draft',
            preBudgetPlanId: data.itemId,
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
                throw new HttpException(
                  `Timeline not found for ${element.name} ${element.procurementReference}`,
                  430,
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

              const requisitioner = element.preBudgetRequisitioners.map(
                (item) => ({
                  ...item,
                  postBudgetPlanActivityId: element.id,
                  id: undefined,
                }),
              );
              await entityManager
                .getRepository(PostBudgetRequisitioner)
                .insert(requisitioner as any);

              const mechanism = element.preProcurementMechanisms?.map(
                (item) => ({
                  ...item,
                  postBudgetPlanActivityId: element.id,
                  id: undefined,
                }),
              );
              await entityManager
                .getRepository(PostProcurementMechanism)
                .insert(mechanism as any);
            } catch (error) {
              throw error;
            }
          }
        }
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async initiateWorkflow(data) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const activities = await this.preBudgetActivityRepository.find({
      where: { preBudgetPlanId: data.id },
      relations: {
        preBudgetPlanTimelines: true,
        preProcurementMechanisms: true,
      },
    });

    if (activities.length == 0) {
      throw new HttpException(`Activity not found `, 430);
    }

    for (const element of activities) {
      if (element.preBudgetPlanTimelines.length == 0) {
        throw new HttpException(
          `Timeline not found for ${element.name} ${element.procurementReference}`,
          430,
        );
      }
      if (element.preProcurementMechanisms.length == 0) {
        throw new HttpException(
          `Procurement Method not found for ${element.name} ${element.procurementReference}`,
          430,
        );
      }
    }

    await entityManager.getRepository(PreBudgetPlan).update(data.id, {
      status: 'Submitted',
    });

    await this.pdfGenerator(data.id, data.itemName);
    await this.planningRMQClient.emit('initiate-workflow', {
      name: data.name,
      id: data.id,
      itemName: data.itemName,
      organizationId: data.organizationId,
    });
  }

  async hashData(id: string) {
    const data = await this.preBudgetActivityRepository.find({
      where: { preBudgetPlanId: id },
      relations: {
        preBudgetPlanItems: true,
        preBudgetPlanTimelines: true,
        preBudgetRequisitioners: true,
        preProcurementMechanisms: true,
      },
    });
    const transformedData = this.instanceToPlainExclude(data, {
      exclude: ['createdAt', 'deletedAt'],
    });

    const hashData = (data) => {
      return createHash('sha-256').update(data).digest('hex');
    };

    const hashedData = hashData(JSON.stringify(data));

    return hashedData;
  }

  async hashMatch(dataId: string, hash: string): Promise<boolean> {
    const originalHash = await this.hashData(dataId);
    return originalHash === hash;
  }

  async pdfGenerator(id: string, itemName: string) {
    const data = await this.preBudgetActivityRepository.find({
      where: { preBudgetPlanId: id },
      relations: {
        preBudgetPlanItems: true,
        preBudgetPlanTimelines: true,
        preBudgetRequisitioners: true,
        preProcurementMechanisms: true,
        preBudgetPlan: {
          app: true,
        },
      },
    });

    const buffer = await this.pdfGeneratorService.pdfGenerator(data, 'pre');

    const fileInfo = await this.minIoService.uploadBuffer(
      buffer,
      'preBudgetPlanReport.pdf',
      'application/pdf',
    );

    await this.documentService.create({
      fileInfo,
      title: itemName,
      itemId: id,
      type: 'preBudgetPlan',
      version: 1,
      key: 'onApprovalSubmit',
    });
  }

  instanceToPlainExclude(
    obj: Record<string, any>,
    options: { exclude?: string[] } = {},
  ): Record<string, any> {
    const plain: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !options.exclude.includes(key)) {
        plain[key] =
          typeof obj[key] === 'object' && obj[key] !== null
            ? this.instanceToPlainExclude(obj[key], options) // Recursively convert nested objects
            : obj[key];
      }
    }
    return plain;
  }
}
