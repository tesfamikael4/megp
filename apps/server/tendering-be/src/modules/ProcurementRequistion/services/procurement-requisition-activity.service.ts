import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionActivity,
} from 'src/entities';
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
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
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
      postBudgetPlanItems: [],
      postProcurementMechanisms: [],
      postBudgetPlanTimelines: [],
      disbursements: [],
      activityBudgetLines: [],
    };

    for (const x of activityData.annualProcurementPlanActivity) {
      const annualProcurementPlanActivity = (
        await this.annualProcurementPlanActivity(x)
      ).items;
      const activity: CreateProcurementRequisitionActivityDto = {
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
    const url = planning_url + 'apps/pr';
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: { q },
    });
    return response.data;
  }

  async postBudgetPlan(organizationId: string, q: string) {
    const url = planning_url + `post-budget-plans/get-with-app/pr`;
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: { q, organizationId },
    });

    return response.data;
  }

  async annualProcurementPlanActivity(id: any) {
    const url = planning_url + '/post-budget-plans/pr' + id;
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

  async annualProcurementPlanActivities(
    id: any,
    organizationId: string,
    q: string,
  ) {
    const apiResponse = {
      items: [],
      total: 0,
    };
    const postBudgetPlan = await this.postBudgetPlan(
      organizationId,
      `w=app.budgetYearId:=:${id}`,
    );
    const activities = await this.annualProcurementPlanActivitiesList(
      postBudgetPlan.items[0].id,
      q,
    );
    apiResponse.items.push(activities);

    // filter already added activities
    const added = await this.repositoryProcurementRequisition.find({
      relations: {
        procurementRequisitionActivities: true,
      },
    });

    // Extract the IDs of the already added procurementRequisitionActivities
    const addedActivityIds = added.flatMap((item) =>
      item.procurementRequisitionActivities.map((activity) => activity.id),
    );

    // Filter out activities with matching IDs from apiResponse.items
    apiResponse.items = apiResponse.items.map((activities) =>
      activities.filter((activity) => !addedActivityIds.includes(activity.id)),
    );
    apiResponse.total = apiResponse.items.length;

    return apiResponse;
  }

  async annualProcurementPlanActivitiesList(id: any, q: string) {
    const url = planning_url + '/post-budget-plans/list/pr' + id;
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': xApiKey,
      },
      params: { q },
    });
    return response.data;
  }
}
