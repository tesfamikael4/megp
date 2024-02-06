import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  AnnualProcurementPlan,
  AnnualProcurementPlanActivity,
} from 'src/entities';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class AnnualProcurementPlanService extends EntityCrudService<AnnualProcurementPlan> {
  constructor(
    @InjectRepository(AnnualProcurementPlan)
    private readonly repositoryAnnualProcurementPlan: Repository<AnnualProcurementPlan>,
    @InjectRepository(AnnualProcurementPlanActivity)
    private readonly repositoryAnnualProcurementPlanActivity: Repository<AnnualProcurementPlanActivity>,
  ) {
    super(repositoryAnnualProcurementPlan);
  }

  async createViaEvent(payload: any): Promise<any> {
    const budgetYear = {
      budgetYearId: payload.app.budgetYears.id,
      budgets: payload.app.budgets,
    };
    const mapApp: any = {
      id: payload.appId,
      name: payload.app.planName,
      description: payload.app.description,
      budgetYear: budgetYear,
      organization: {
        id: payload.app.organizationId,
      },
      status: payload.app.status,
    };
    const app = await this.repositoryAnnualProcurementPlan.save(mapApp);
    if (app) {
      const activity = [];
      const postBudgetPlanActivities = payload.postBudgetPlanActivities;
      postBudgetPlanActivities.forEach((element) => {
        if (element.postProcurementMechanisms) {
          activity.push({
            id: element.id,
            annualProcurementPlanId: app.id,
            postBudgetPlanId: element.postBudgetPlanId,
            activityName: element.name,
            procurementReferenceNumber: element.procurementReference,
            description: element.description,
            estimatedAmount: element.estimatedAmount,
            calculatedAmount: element.calculatedAmount,
            currency: element.currency,
            status: element.status,
            isMultipleYear: element.isMultipleYear,
            remark: element.remark,
            classification: element.classification,
            annualProcurementPlanItems: element.postBudgetPlanItems,
            annualProcurementPlanTimelines: element.postBudgetPlanTimelines,
            procurementMechanisms: element.postProcurementMechanisms[0],
            annualProcurementPlanDisbursements:
              element.postBudgePlantDisbursements,
            requisitionerAssignments: element.postBudgetRequisitioners,
          });
        }
      });

      const insertActivity =
        this.repositoryAnnualProcurementPlanActivity.create(activity);
      await this.repositoryAnnualProcurementPlanActivity.save(insertActivity);
    }
  }
}
