import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import {
  Budget,
  PostBudgetPlanActivity,
  ProcurementRequisition,
} from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { ProcurementRequisitionStatusEnum } from 'src/shared/enums';
import { PdfGeneratorService } from 'src/modules/utility/services/pdf-generator.service';
import { DocumentService } from 'src/modules/utility/services/document.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { ProcurementApplication } from 'src/shared/domain';

@Injectable()
export class ProcurementRequisitionService extends EntityCrudService<ProcurementRequisition> {
  constructor(
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
    @InjectRepository(Budget)
    private readonly repositoryBudget: Repository<Budget>,
    @Inject('PR_RMQ_SERVICE')
    private readonly prRMQClient: ClientProxy,
    private readonly minIoService: MinIOService,

    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly documentService: DocumentService,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryProcurementRequisition);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (itemData.userReference) {
      const uniqueUserRef = await this.repositoryProcurementRequisition.exists({
        where: {
          userReference: itemData.userReference,
          organizationId: req.user.organization.id,
        },
      });

      if (uniqueUserRef) {
        throw new HttpException('User reference is already in use', 430);
      }
    }

    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }

    const item = this.repositoryProcurementRequisition.create(itemData);
    await this.repositoryProcurementRequisition.insert(item);
    return item;
  }

  async updatePr(
    id: string,
    itemData: any,
    organizationId: string,
  ): Promise<ProcurementRequisition> {
    const existingItem = await this.repositoryProcurementRequisition.findOne({
      where: { id },
    });
    if (
      itemData.userReference &&
      existingItem?.userReference !== itemData.userReference
    ) {
      const uniqueUserRef = await this.repositoryProcurementRequisition.exists({
        where: {
          userReference: itemData.userReference,
          organizationId,
        },
      });

      if (uniqueUserRef) {
        throw new HttpException('User reference is already in use', 430);
      }
    }

    await this.repositoryProcurementRequisition.update(id, itemData);
    return this.findOne(id);
  }

  async getCurrentBudget(query?: CollectionQuery) {
    const date = new Date();
    query.where.push([
      {
        column: 'budgetYears.startDate',
        operator: '<=',
        value: date,
      },
    ]);
    query.where.push([
      {
        column: 'budgetYears.endDate',
        operator: '>=',
        value: date,
      },
    ]);
    query.includes.push('budgetYears');
    const dataQuery = QueryConstructor.constructQuery<Budget>(
      this.repositoryBudget,
      query,
    );
    const response = new DataResponseFormat<Budget>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
  async findOne(id: string): Promise<ProcurementRequisition> {
    const result = await this.repositoryProcurementRequisition.findOne({
      where: {
        id,
      },
      relations: {
        budgetYear: true,
        budget: true,
        procurementMechanisms: true,
      },
    });
    return result;
  }
  async selectFromAPP(
    itemData: any,
    user: any,
  ): Promise<ProcurementRequisition> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const activity: any = await this.repositoryPostBudgetPlanActivity.findOne({
      where: {
        id: itemData.id,
        organizationId: user.organization.id,
        postBudgetRequisitioners: {
          userId: user.userId,
        },
      },
      relations: {
        postBudgetPlan: true,
        budget: true,
        postBudgetPlanItems: true,
        postBudgetPlanTimelines: true,
        postProcurementMechanism: true,
      },
    });

    if (!activity) {
      throw new HttpException(
        'This Activity is not found in your organization',
        430,
      );
    }
    if (activity.status === 'USED_IN_PR') {
      throw new HttpException(
        'Activity is used in Procurement requisition',
        430,
      );
    }
    if (
      !activity.postBudgetPlan ||
      activity.postBudgetPlan.status.toUpperCase() !==
        ProcurementRequisitionStatusEnum.APPROVED
    ) {
      throw new HttpException('Plan is not approved', 430);
    }
    if (activity.userReference) {
      const uniqueUserRef = await this.repositoryProcurementRequisition.exists({
        where: {
          userReference: activity.userReference,
          organizationId: activity.organizationId,
        },
      });
      if (uniqueUserRef) {
        throw new HttpException('User reference is already in use', 430);
      }
    }
    const procurementRequisitionItems = activity.postBudgetPlanItems;
    procurementRequisitionItems.forEach((x: any) => (x.uom = x.uomName));
    const procurementRequisitionTimelines = activity.postBudgetPlanTimelines;
    procurementRequisitionTimelines.forEach(
      (x: any) => (
        (x.appDueDate = new Date(x.dueDate)),
        (x.organizationId = user.organization.id)
      ),
    );
    const procurementRequisition: ProcurementRequisition = {
      ...activity,
      postBudgetPlanActivityId: itemData.id,
      isPlanned: true,
      totalEstimatedAmount: activity.estimatedAmount,
      userReference: activity.userReference,
      postBudgetPlanId: activity.postBudgetPlan.id,
      budgetYearId: activity.budget.budgetYearId,
      budgetId: activity.budget.id,
      status: ProcurementRequisitionStatusEnum.DRAFT,
      organizationId: user.organization.id,
      organizationName: user.organization.name,
      procurementRequisitionItems,
      procurementMechanisms: activity.postProcurementMechanism
        ? activity.postProcurementMechanism
        : null,
      procurementRequisitionTimelines,
    };
    const isFundAvailable = false; // TODO: check if fund is available
    activity.isFundAvailable = isFundAvailable;
    activity.isCustom = false;

    await entityManager
      .getRepository(PostBudgetPlanActivity)
      .update(activity.id, {
        status: 'USED_IN_PR',
      });
    return await entityManager
      .getRepository(ProcurementRequisition)
      .save(procurementRequisition);
  }

  async initiateWorkflow(data: any): Promise<boolean> {
    const pr = await this.repositoryProcurementRequisition.findOneOrFail({
      where: {
        id: data.id,
        organizationId: data.organizationId,
        status: ProcurementRequisitionStatusEnum.DRAFT,
      },
      select: {
        id: true,
        name: true,
        organizationId: true,
      },
      relations: {
        procurementMechanisms: true,
        procurementRequisitionItems: true,
        procurementRequisitionTimelines: true,
        procurementRequisitionTechnicalTeams: true,
      },
    });
    if (pr.procurementRequisitionItems.length === 0) {
      throw new HttpException('Procurement Requisition Items is empty', 430);
    }
    if (pr.procurementRequisitionTimelines.length === 0) {
      throw new HttpException('Procurement Requisition Timeline is empty', 430);
    }
    if (!pr.procurementMechanisms) {
      throw new HttpException(
        'Procurement Requisition Mechanism is empty',
        430,
      );
    }
    if (pr.procurementRequisitionTechnicalTeams.length !== 0) {
      throw new HttpException(
        'Procurement Requisition Technical Team should be empty',
        430,
      );
    }
    const prWithName = {
      itemName: pr.name,
      id: pr.id,
      organizationId: pr.organizationId,
      name: 'procurementRequisition',
    };
    await this.pdfGenerator(data.id, prWithName.itemName, {
      organizationId: data.organizationId,
      organizationName: data.organizationName,
    });
    this.prRMQClient.emit('initiate-workflow', prWithName);
    await this.repositoryProcurementRequisition.update(pr.id, {
      status: ProcurementRequisitionStatusEnum.SUBMITTED,
    });
    return true;
  }

  async prApprovalDecision(data: any): Promise<void> {
    let { status } = data;
    status =
      status.toUpperCase() === ProcurementRequisitionStatusEnum.REJECTED
        ? ProcurementRequisitionStatusEnum.DRAFT
        : status.toUpperCase();
    await this.repositoryProcurementRequisition.update(data.itemId, { status });
  }

  //reports
  async calculateTargetGroupPercentage(
    postBudgetPlanId: string,
  ): Promise<Record<string, number>> {
    const procurementRequisitions =
      await this.repositoryProcurementRequisition.find({
        where: { postBudgetPlanId: postBudgetPlanId },
        relations: {
          postBudgetPlan: true,
          procurementMechanisms: true,
        },
      });

    if (!procurementRequisitions) {
      throw new NotFoundException(`Procurement Requisition does not found`);
    }

    const targetGroupCounts: Record<string, number> = {};

    procurementRequisitions.forEach((pr) => {
      const targetGroups = pr.procurementMechanisms?.targetGroup || [];
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
            +pr.totalEstimatedAmount;
          msme = true;
        } else if (!target) {
          targetGroupCounts[group] =
            (targetGroupCounts[group] || 0) + +pr.totalEstimatedAmount;
        }
      });
    });

    const totalMechanisms = procurementRequisitions.reduce(
      (total, pr) => total + +pr.totalEstimatedAmount,
      0,
    );

    const targetGroupPercentages: Record<string, number> = {};

    for (const group in targetGroupCounts) {
      const percentage = (targetGroupCounts[group] / totalMechanisms) * 100;
      targetGroupPercentages[group] = parseFloat(percentage.toFixed(2));
    }

    return targetGroupPercentages;
  }
  async getAnalytics(id: string): Promise<{
    totalItems: number;
    currencyTotalAmounts: Record<string, number>;
  }> {
    const procurementRequisition =
      await this.repositoryProcurementRequisition.findOne({
        where: { id: id },
        relations: ['procurementRequisitionItems'],
      });

    if (!procurementRequisition) {
      throw new NotFoundException(`Procurement Requisition does not found`);
    }
    const currencyTotalAmounts: Record<string, number> = {};
    let totalAmount = 0;
    const totalItems =
      procurementRequisition.procurementRequisitionItems.length;

    procurementRequisition.procurementRequisitionItems.forEach((item) => {
      const itemTotalAmount = item.quantity * item.unitPrice;
      totalAmount += itemTotalAmount;

      const currency = item.currency;

      if (currencyTotalAmounts[currency]) {
        currencyTotalAmounts[currency] += itemTotalAmount;
      } else {
        currencyTotalAmounts[currency] = itemTotalAmount;
      }
    });
    return { totalItems, currencyTotalAmounts };
  }

  async getReport(id: string) {
    const pr = await this.repositoryProcurementRequisition.findOne({
      where: {
        id,
      },
      relations: {
        procurementMechanisms: true,
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
    const mechanism = pr.procurementMechanisms;
    procurementType[mechanism.procurementType]++;
    procurementMethods[mechanism.procurementMethod]++;
    fundingSources[mechanism.fundingSource]++;
    const online = mechanism.isOnline ? 'true' : 'false';
    isOnline[online]++;
    const target = mechanism.targetGroup.includes(
      'Small Enterprises' || 'Micro Enterprises' || 'Medium Enterprises',
    )
      ? 'MSM Enterprises'
      : mechanism.targetGroup;
    targetGroups[target]++;

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

  async pdfGenerator(
    id: string,
    itemName: string,
    organization: { organizationId: string; organizationName: string },
  ) {
    const data = await this.repositoryProcurementRequisition.findOne({
      where: { id: id },
      relations: {
        procurementRequisitionItems: true,
        procurementRequisitionTimelines: true,
        procurementRequisitionTechnicalTeams: true,
        procurementMechanisms: true,
        postBudgetPlan: {
          app: true,
        },
        budgetYear: true,
        reasons: true,
      },
    });
    const buffer = await this.pdfGeneratorService.pdfGenerator(data, 'pr');

    const fileInfo = await this.minIoService.uploadBuffer(
      buffer,
      'procurementRequisitionReport.pdf',
      'application/pdf',
    );

    await this.documentService.create(
      {
        fileInfo,
        title: itemName,
        itemId: id,
        type: 'procurementRequisition',
        version: 1,
        key: 'onApprovalSubmit',
      },
      organization,
    );
    return buffer;
  }

  async getProcurementRequisitionById(id: string) {
    const pr = await this.repositoryProcurementRequisition.findOne({
      where: {
        id,
        isUsed: false,
        status: ProcurementRequisitionStatusEnum.APPROVED,
      },
      relations: {
        procurementRequisitionItems: true,
        procurementRequisitionTechnicalTeams: true,
        procurementMechanisms: true,
        budget: true,
      },
    });
    return pr;
  }

  async getProcurementRequisitions(query: CollectionQuery, user?: any) {
    query.includes.push('procurementRequisitionTechnicalTeams');

    query.where.push([
      {
        column: 'status',
        value: ProcurementRequisitionStatusEnum.APPROVED,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'procurementApplication',
        value: ProcurementApplication.TENDERING,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'organizationId',
        value: user.organization.id,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'procurementRequisitionTechnicalTeams.userId',
        value: user.userId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'isUsed',
        value: false,
        operator: FilterOperators.EqualTo,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<ProcurementRequisition>(
      this.repositoryProcurementRequisition,
      query,
    );

    const response = new DataResponseFormat<ProcurementRequisition>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
  async getProcurementRequisitionsForMarketplace(
    query: CollectionQuery,
    user?: any,
  ) {
    query.includes.push('procurementRequisitionTechnicalTeams');

    query.where.push([
      {
        column: 'status',
        value: ProcurementRequisitionStatusEnum.APPROVED,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'procurementApplication',
        value: ProcurementApplication.AUCTIONING,
        operator: FilterOperators.EqualTo,
      },
      {
        column: 'procurementApplication',
        value: ProcurementApplication.PURCHASING,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'organizationId',
        value: user.organization.id,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'procurementRequisitionTechnicalTeams.userId',
        value: user.userId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'isUsed',
        value: false,
        operator: FilterOperators.EqualTo,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<ProcurementRequisition>(
      this.repositoryProcurementRequisition,
      query,
    );

    const response = new DataResponseFormat<ProcurementRequisition>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async getProcurementRequisitionStatus(query: CollectionQuery, req?: any) {
    query.where.push([
      {
        column: 'status',
        value: ProcurementRequisitionStatusEnum.APPROVED,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'isUsed',
        value: true,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.where.push([
      {
        column: 'organizationId',
        value: req.user.organization.id,
        operator: FilterOperators.EqualTo,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ProcurementRequisition>(
      this.repositoryProcurementRequisition,
      query,
    );

    const response = new DataResponseFormat<ProcurementRequisition>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async updateProcurementRequisitionIsUsed(id: string) {
    await this.repositoryProcurementRequisition.update(id, {
      isUsed: true,
    });
  }
}
