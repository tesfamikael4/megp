import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { PostBudgetPlanActivity, ProcurementRequisition } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { ProcurementRequisitionStatusEnum } from 'src/shared/enums';
import { PdfGeneratorService } from 'src/modules/utility/services/pdf-generator.service';
import { DocumentService } from 'src/modules/utility/services/document.service';
import { MinIOService } from 'src/shared/min-io/min-io.service';

@Injectable()
export class ProcurementRequisitionService extends EntityCrudService<ProcurementRequisition> {
  constructor(
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
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
        postBudgetPlanItems: true,
        postBudgetPlanTimelines: true,
        postProcurementMechanism: true,
      },
    });

    if (!activity || activity.status === 'USED_IN_PR') {
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

    const procurementRequisitionItems = activity.postBudgetPlanItems;
    procurementRequisitionItems.forEach((x: any) => (x.uom = x.uomName));
    const procurementRequisitionTimelines = activity.postBudgetPlanTimelines;
    procurementRequisitionTimelines.forEach(
      (x: any) => (x.appDueDate = new Date(x.dueDate)),
    );
    const procurementRequisition: ProcurementRequisition = {
      ...activity,
      id: itemData.id,
      isPlanned: true,
      totalEstimatedAmount: activity.estimatedAmount,
      userReference: `u${activity.procurementReference}`,
      postBudgetPlanId: activity.postBudgetPlan.id,
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
    });
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
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const sourceEntity =
      await this.repositoryProcurementRequisition.findOneOrFail({
        where: { id: data.itemId },
      });
    await entityManager
      .getRepository(ProcurementRequisition)
      .update(sourceEntity.id, {
        status: data.status,
      });
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
      where: { id },
      relations: {
        procurementRequisitionItems: true,
        procurementRequisitionTechnicalTeams: true,
        procurementMechanisms: true,
      },
    });
    return pr;
  }
}
