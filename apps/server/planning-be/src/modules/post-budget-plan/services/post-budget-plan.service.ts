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
import { PdfGeneratorService } from 'src/modules/utility/services/pdf-generator.service';
import { DocumentService } from 'src/modules/utility/services/document.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';

@Injectable()
export class PostBudgetPlanService extends ExtraCrudService<PostBudgetPlan> {
  constructor(
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,

    @InjectRepository(PostBudgetPlanActivity)
    private readonly postBudgetActivityRepository: Repository<PostBudgetPlanActivity>,

    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly documentService: DocumentService,

    private readonly minIoService: MinIOService,

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

    const totalActivities = postBudgetPlan.postBudgetPlanActivities.length;

    postBudgetPlan.postBudgetPlanActivities.forEach((activity) => {
      const currency = activity.currency;

      if (currencyTotalAmounts[currency]) {
        currencyTotalAmounts[currency] += +activity.estimatedAmount;
      } else {
        currencyTotalAmounts[currency] = +activity.estimatedAmount;
      }
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
        'postBudgetPlanActivities.postProcurementMechanism',
      ],
    });

    if (!postBudgetPlan) {
      throw new NotFoundException(`PostBudgetPlan not found`);
    }

    const targetGroupCounts: Record<string, number> = {};

    postBudgetPlan.postBudgetPlanActivities.forEach((activity) => {
      const targetGroups = activity.postProcurementMechanism?.targetGroup || [];
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

    const totalMechanisms = postBudgetPlan.postBudgetPlanActivities.reduce(
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

  async getReport(postBudgetPlanId: string) {
    const activities = await this.postBudgetActivityRepository.find({
      where: {
        postBudgetPlanId,
      },
      relations: {
        postProcurementMechanism: true,
      },
    });

    const procurementType = {
      Goods: 0,
      Works: 0,
      'Non Consulting Services': 0,
      'Consultancy Services': 0,
      'Motor Vehicle Repair': 0,
    };

    const procurementMethods = {
      'Request for Quotation (RFQ)': 0,
      'National Competitive Bidding (NCB)': 0,
      'International Competitive Bidding (ICB)': 0,
      'Restricted Tender': 0,
      'Single Source Procurement': 0,
      'Request for Proposal (RFP)': 0,
      'Two Stage Bidding': 0,
      'Framework Procurement': 0,
      'Purchased Orders (Call off)': 0,
    };

    const fundingSources = {
      'Internal Revenue': 0,
      Treasury: 0,
      Loan: 0,
      Donor: 0,
    };
    const isOnline = {
      true: 0,
      false: 0,
    };

    const targetGroups = {
      IBM: 0,
      'MSM Enterprises': 0,
      'Marginalized Group': 0,
      Others: 0,
    };
    activities.forEach((element) => {
      procurementType[element.postProcurementMechanism.procurementType]++;
      procurementMethods[element.postProcurementMechanism.procurementMethod]++;
      fundingSources[element.postProcurementMechanism.fundingSource]++;
      const online = element.postProcurementMechanism.isOnline
        ? 'true'
        : 'false';
      isOnline[online]++;
      const validGroups = [
        'Small Enterprises',
        'Micro Enterprises',
        'Medium Enterprises',
      ];
      element.postProcurementMechanism.targetGroup.forEach((element) => {
        const target = validGroups.includes(element)
          ? 'MSM Enterprises'
          : element;

        targetGroups[target]++;
      });
    });

    const result = {
      procurementType: this.calculatePercentage(procurementType),
      procurementMethods: this.calculatePercentage(procurementMethods),
      fundingSources: this.calculatePercentage(fundingSources),
      isOnline: this.calculatePercentage(isOnline),
      targetGroups: this.calculatePercentage(targetGroups),
    };
    return result;
  }

  calculatePercentage(percentageGroup) {
    const total: number = Object.values(percentageGroup).reduce(
      (acc: number, val: number) => acc + val,
      0,
    ) as number;
    const percentages: Record<string, { count: number; percentage: number }> =
      {};

    for (const group in percentageGroup) {
      if (percentageGroup.hasOwnProperty(group)) {
        const count = percentageGroup[group];
        const percentage = (count / total) * 100;
        percentages[group] = { count, percentage };
      }
    }

    return {
      percentages,
      total: total,
    };
  }

  async initiateWorkflow(data) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const activities = await this.postBudgetActivityRepository.find({
      where: { postBudgetPlanId: data.id },
      relations: {
        postBudgetPlanTimelines: true,
        postProcurementMechanism: true,
        postBudgetRequisitioners: true,
        budget: true,
      },
    });

    for (const element of activities) {
      if (element.postBudgetPlanTimelines.length == 0) {
        throw new HttpException(
          `Timeline not found for ${element.name} ${element.procurementReference}`,
          430,
        );
      }
      if (!element.postProcurementMechanism) {
        throw new HttpException(
          `Procurement Method not found for ${element.name} ${element.procurementReference}`,
          430,
        );
      }
      if (element.postBudgetRequisitioners?.length == 0) {
        throw new HttpException(
          `Requisitioner not found for ${element.name} ${element.procurementReference}`,
          430,
        );
      }
      if (element.budgetId == null) {
        throw new HttpException(
          `Budget is not linked for ${element.name} ${element.procurementReference}`,
          430,
        );
      }
    }

    await entityManager.getRepository(PostBudgetPlan).update(data.id, {
      status: 'Submitted',
    });
    await this.pdfGenerator(data.id, data.itemName, {
      organizationId: data.organizationId,
      organizationName: data.organizationName,
    });
    await this.planningRMQClient.emit('initiate-workflow', {
      name: data.name,
      id: data.id,
      itemName: data.itemName,
      organizationId: data.organizationId,
    });
  }

  async approvePostBudget(data: any): Promise<void> {
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
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async pdfGenerator(
    id: string,
    itemName: string,
    organization: { organizationId: string; organizationName: string },
  ) {
    const data = await this.postBudgetActivityRepository.find({
      where: { postBudgetPlanId: id },
      relations: {
        postBudgetPlanItems: true,
        postBudgetPlanTimelines: true,
        postBudgetRequisitioners: true,
        postProcurementMechanism: true,
        postBudgetPlan: {
          app: true,
        },
        reasons: true,
      },
    });
    const buffer = await this.pdfGeneratorService.pdfGenerator(data, 'post');

    const fileInfo = await this.minIoService.uploadBuffer(
      buffer,
      'preBudgetPlanReport.pdf',
      'application/pdf',
    );

    await this.documentService.create(
      {
        fileInfo,
        title: itemName,
        itemId: id,
        type: 'preBudgetPlan',
        version: 1,
        key: 'onApprovalSubmit',
      },
      organization,
    );
    return buffer;
  }

  async checkNCB(postBudgetPlanId: string) {
    const activities = await this.postBudgetActivityRepository.find({
      where: {
        postBudgetPlanId,
        postProcurementMechanism: {
          procurementMethod: 'National Competitive Bidding (NCB)',
        },
      },
      relations: {
        postProcurementMechanism: true,
      },
      select: {
        id: true,
        postProcurementMechanism: {
          targetGroup: true,
        },
      },
    });
    if (activities.length == 0) {
      return { pass: true };
    }
    const ibmActivities = activities.filter((activity) =>
      activity.postProcurementMechanism.targetGroup.includes('IBM'),
    );

    const response = {
      percentage: (ibmActivities.length / activities.length) * 100,
      pass: ibmActivities.length / activities.length < 0.6 ? false : true,
    };
    return response;
  }
}
