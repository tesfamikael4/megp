import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import {
  AnnualProcurementPlanActivity,
  ProcurementRequisitionActivity,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import {
  AssignAnnualProcurementPlanActivityDto,
  CreateProcurementRequisitionActivityDto,
} from '../dto/procurement-requisition-activity.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query/query-mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProcurementRequisitionActivityService extends ExtraCrudService<ProcurementRequisitionActivity> {
  constructor(
    @InjectRepository(ProcurementRequisitionActivity)
    private readonly repositoryProcurementRequisitionActivity: Repository<ProcurementRequisitionActivity>,

    @InjectRepository(AnnualProcurementPlanActivity)
    private readonly repositoryAnnualProcurementPlanActivity: Repository<AnnualProcurementPlanActivity>,

    private readonly eventEmitter: EventEmitter2,
  ) {
    super(repositoryProcurementRequisitionActivity);
  }
  async create(
    activityData: AssignAnnualProcurementPlanActivityDto,
    req?: any,
  ): Promise<any> {
    const extraCrudOptions = {
      entityIdName: 'procurementRequisitionId',
    };

    const activities = {
      annualProcurementPlanItems: [],
      postProcurementMechanisms: [],
      annualProcurementPlanTimelines: [],
      annualProcurementDisbursements: [],
      activityBudgetLines: [],
    };
    const annualProcurementPlanActivities =
      await this.annualProcurementPlanActivity(
        activityData.annualProcurementPlanActivity,
      );

    for (const annualProcurementPlanActivity of annualProcurementPlanActivities) {
      const activity: CreateProcurementRequisitionActivityDto = {
        annualProcurementPlanActivityId: annualProcurementPlanActivity.id,
        procurementRequisitionId: activityData.procurementRequisitionId,
      };

      if (
        annualProcurementPlanActivity.annualProcurementItems &&
        annualProcurementPlanActivity.annualProcurementPlanItems.length > 0
      ) {
        annualProcurementPlanActivity.annualProcurementPlanItems.forEach(
          (item) => {
            const newItem = {
              ...item,
              procurementRequisitionId: activityData.procurementRequisitionId,
              annualProcurementPlanBudgetLineId:
                activityData.procurementRequisitionId, // will replace by annualProcurementPlanBudgetLineId
            };
            activities.annualProcurementPlanItems.push(newItem);
          },
        );
      }

      if (
        annualProcurementPlanActivity.annualProcurementDisbursements &&
        annualProcurementPlanActivity.annualProcurementDisbursements.length > 0
      ) {
        annualProcurementPlanActivity.annualProcurementDisbursements.forEach(
          (disbursement) => {
            const newDisbursement = {
              ...disbursement,
              procurementRequisitionId: activityData.procurementRequisitionId,
            };
            activities.annualProcurementDisbursements.push(newDisbursement);
          },
        );
      }

      if (
        annualProcurementPlanActivity.activityBudgetLines &&
        annualProcurementPlanActivity.activityBudgetLines.length > 0
      ) {
        annualProcurementPlanActivity.activityBudgetLines.forEach((plan) => {
          const newPlan = {
            ...plan,
            procurementRequisitionId: activityData.procurementRequisitionId,
          };
          activities.activityBudgetLines.push(newPlan);
        });
      }

      if (
        annualProcurementPlanActivity.annualProcurementPlanTimelines &&
        annualProcurementPlanActivity.annualProcurementPlanTimelines.length > 0
      ) {
        annualProcurementPlanActivity.annualProcurementPlanTimelines.forEach(
          (timeline) => {
            const newTimeline = {
              ...timeline,
              procurementRequisitionId: activityData.procurementRequisitionId,
            };
            activities.annualProcurementPlanTimelines.push(newTimeline);
          },
        );
      }
      if (
        annualProcurementPlanActivity.postProcurementMechanisms &&
        annualProcurementPlanActivity.postProcurementMechanisms.length > 0
      ) {
        annualProcurementPlanActivity.postProcurementMechanisms.forEach(
          (method) => {
            const newTimeline = {
              ...method,
              procurementRequisitionId: activityData.procurementRequisitionId,
            };
            activities.postProcurementMechanisms.push(newTimeline);
          },
        );
      }

      await super.create(activity);
      await this.updateAnnualProcurementPlanActivity(
        activityData.annualProcurementPlanActivity,
      );
    }

    // event emitter to assign items to the to PR
    if (activities.annualProcurementPlanItems.length > 0) {
      this.eventEmitter.emit(
        'create.pr_items',
        activities.annualProcurementPlanItems,
      );
    }
    if (activities.postProcurementMechanisms.length > 0) {
      this.eventEmitter.emit(
        'create.pr_mechanisms',
        activities.postProcurementMechanisms,
      );
    }
    if (activities.annualProcurementPlanTimelines.length > 0) {
      this.eventEmitter.emit(
        'create.pr_timelines',
        activities.annualProcurementPlanTimelines,
      );
    }
    if (activities.annualProcurementDisbursements.length > 0) {
      this.eventEmitter.emit(
        'create.pr_disbursements',
        activities.annualProcurementDisbursements,
      );
    }

    const query = decodeCollectionQuery(null);
    return super.findAll(
      activityData.procurementRequisitionId,
      query,
      extraCrudOptions,
      req,
    );
  }

  async update(
    id: string,
    itemData: any,
  ): Promise<ProcurementRequisitionActivity> {
    throw new Error('Cannot update procurement Requisition Activity for now');
  }
  async annualProcurementPlanActivity(ids: any): Promise<any> {
    return this.repositoryAnnualProcurementPlanActivity.find({
      where: {
        id: In(ids),
        status: 'Approved',
      },
      relations: [
        'annualProcurementPlanItems',
        'annualProcurementPlanTimelines',
        'annualProcurementPlanDisbursements',
        'procurementMechanisms',
        // 'requisitionerAssignments',
      ],
    });
  }
  async updateAnnualProcurementPlanActivity(ids: any): Promise<any> {
    await this.repositoryAnnualProcurementPlanActivity.update(
      { id: In(ids), status: 'Approved' },
      { status: 'Assigned' },
    );
  }
}
