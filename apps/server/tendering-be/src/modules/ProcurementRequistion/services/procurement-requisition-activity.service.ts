import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProcurementRequisitionActivity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import axios from 'axios';
import {
  AssignAnnualProcurementPlanActivityDto,
  CreateProcurementRequisitionActivityDto,
} from '../dto/procurement-requisition-activity.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query/query-mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';

const planning_url = process.env.PLANNING_API ?? 'planning/api/';
const xApiKey = process.env.X_API_KEY ?? '25bc1622e5fb42cca3d3e62e90a3a20f';

@Injectable()
export class ProcurementRequisitionActivityService extends ExtraCrudService<ProcurementRequisitionActivity> {
  constructor(
    @InjectRepository(ProcurementRequisitionActivity)
    private readonly repositoryProcurementRequisitionActivity: Repository<ProcurementRequisitionActivity>,
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
      postBudgetPlanItems: ({} = []),
      postProcurementMechanisms: ({} = []),
      postBudgetPlanTimelines: ({} = []),
      disbursements: ({} = []),
      activityBudgetLines: ({} = []),
    };

    const app = await this.annualProcurementPlan(
      `w=budgetYearId=${activityData.annualProcurementPlanActivity[0]}`,
    );
    for (const x of activityData.annualProcurementPlanActivity) {
      const annualProcurementPlanActivity = (
        await this.annualProcurementPlanActivity(x)
      ).items;
      const activity: CreateProcurementRequisitionActivityDto = {
        annualProcurementPlan: app[0],
        annualProcurementPlanActivityId: annualProcurementPlanActivity.id,
        procurementRequisitionId: activityData.procurementRequisitionId,
      };

      if (
        annualProcurementPlanActivity.postBudgetPlanItems &&
        annualProcurementPlanActivity.postBudgetPlanItems.length > 0
      ) {
        annualProcurementPlanActivity.postBudgetPlanItems.forEach((item) => {
          const newItem = {
            ...item,
            procurementRequisitionId: activityData.procurementRequisitionId,
            annualProcurementPlanBudgetLineId:
              activityData.procurementRequisitionId, // will replace by annualProcurementPlanBudgetLineId
          };
          activities.postBudgetPlanItems.push(newItem);
        });
      }

      if (
        annualProcurementPlanActivity.disbursements &&
        annualProcurementPlanActivity.disbursements.length > 0
      ) {
        annualProcurementPlanActivity.disbursements.forEach((disbursement) => {
          const newDisbursement = {
            ...disbursement,
            procurementRequisitionId: activityData.procurementRequisitionId,
          };
          activities.disbursements.push(newDisbursement);
        });
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
        annualProcurementPlanActivity.postBudgetPlanTimelines &&
        annualProcurementPlanActivity.postBudgetPlanTimelines.length > 0
      ) {
        annualProcurementPlanActivity.postBudgetPlanTimelines.forEach(
          (timeline) => {
            const newTimeline = {
              ...timeline,
              procurementRequisitionId: activityData.procurementRequisitionId,
            };
            activities.postBudgetPlanTimelines.push(newTimeline);
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
    }

    // event emitter to assign items to the to PR
    if (activities.postBudgetPlanItems.length > 0) {
      this.eventEmitter.emit('create.pr_items', activities.postBudgetPlanItems);
    }
    if (activities.postProcurementMechanisms.length > 0) {
      this.eventEmitter.emit(
        'create.pr_mechanisms',
        activities.postProcurementMechanisms,
      );
    }
    if (activities.postBudgetPlanTimelines.length > 0) {
      this.eventEmitter.emit(
        'create.pr_timelines',
        activities.postBudgetPlanTimelines,
      );
    }
    if (activities.disbursements.length > 0) {
      this.eventEmitter.emit(
        'create.pr_disbursements',
        activities.disbursements,
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

  async annualProcurementPlan(q: string) {
    const url = planning_url + 'apps';
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: { q },
    });
    return response.data;
  }

  async postBudgetPlan(q: string) {
    const url = planning_url + 'post-budget-plans/get-with-app';
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: { q },
    });

    return response.data;
  }

  async annualProcurementPlanActivity(id: any) {
    const url = planning_url + '/post-budget-plan-activities/' + id;
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: {
        q: 'i=postBudgetPlanItems,postProcurementMechanisms,postProcurementTimelines,postProcurementDisbursements',
      },
    });
    return response.data;
  }

  async annualProcurementPlanActivities(id: any, q: string) {
    const apiResponse = {
      items: [],
      total: 0,
    };
    const postBudgetPlan = await this.postBudgetPlan(
      `w=app.budgetYearId=${id}`,
    );
    for (const x of postBudgetPlan.items) {
      apiResponse.items.push(
        await this.annualProcurementPlanActivitiesList(x.id, q),
      );
    }
    return apiResponse;
  }

  async annualProcurementPlanActivitiesList(id: any, q: string) {
    const url = planning_url + '/post-budget-plan-activities/list/' + id;
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: { q },
    });
    return response.data;
  }
}
