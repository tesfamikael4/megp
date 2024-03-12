import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionTimeline,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementRequisitionTimelineService extends ExtraCrudService<ProcurementRequisitionTimeline> {
  constructor(
    @InjectRepository(ProcurementRequisitionTimeline)
    private readonly repositoryProcurementRequisitionTimeline: Repository<ProcurementRequisitionTimeline>,
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryProcurementRequisitionTimeline);
  }
  async bulkCreate(timelines: any[], user: any) {
    const organizationId = user?.organization?.id;
    const procurementRequisitionId = timelines[0].procurementRequisitionId;

    timelines.forEach((timeline) => {
      timeline.organizationId = organizationId;
    });

    const procurementRequisition =
      await this.repositoryProcurementRequisition.findOne({
        where: {
          id: procurementRequisitionId,
        },
        relations: {
          postBudgetPlan: {
            app: { budgetYears: true },
          },
        },
        select: {
          id: true,
          postBudgetPlan: {
            id: true,
            app: {
              id: true,
              budgetYears: { endDate: true, startDate: true },
            },
          },
        },
      });

    const budgetPlanEndDate = new Date(
      procurementRequisition.postBudgetPlan.app.budgetYears.endDate,
    );
    const budgetPlanStartDate = new Date(
      procurementRequisition.postBudgetPlan.app.budgetYears.startDate,
    );

    // Validate timelines
    const validationResult = this.validateTimelines(
      timelines,
      budgetPlanStartDate,
      budgetPlanEndDate,
    );
    if (validationResult !== true) {
      throw new HttpException(validationResult, 430);
    }

    await this.repositoryProcurementRequisitionTimeline.delete({
      procurementRequisitionId,
      organizationId,
    });

    const timelineEntities =
      this.repositoryProcurementRequisitionTimeline.create(timelines);
    await this.repositoryProcurementRequisitionTimeline.insert(
      timelineEntities,
    );

    return timelines;
  }

  validateTimelines(timelines: any[], startDate: Date, endDate: Date) {
    const ordered = timelines.sort((a, b) => a.order - b.order);
    if (new Date(ordered[0].dueDate) < startDate) {
      return 'Start date must be greater than budget plan start date';
    }

    if (new Date(ordered[ordered.length - 1].dueDate) > endDate) {
      return 'End date must be less than budget plan end date';
    }

    for (let i = 0; i < ordered.length - 1; i++) {
      const dueDate = new Date(ordered[i].dueDate);
      const nextDueDate = new Date(ordered[i + 1].dueDate);
      const assumedNextDueDate = new Date(dueDate);
      assumedNextDueDate.setDate(
        assumedNextDueDate.getDate() + Number(ordered[i + 1].period),
      );

      if (
        assumedNextDueDate.getTime() !== nextDueDate.getTime() ||
        i !== ordered[i].order
      ) {
        return 'Timeline validation error. Due dates must be sequential with correct period difference and order';
      }
    }

    return true;
  }
}
