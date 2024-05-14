import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionTimeline,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { BulkTimelineDto } from '../dto/procurement-requisition-timeline.dto';

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

  async bulkCreate(
    timelines: any,
    organization: any,
  ): Promise<BulkTimelineDto> {
    try {
      await this.repositoryProcurementRequisitionTimeline.delete({
        procurementRequisitionId: timelines[0].procurementRequisitionId,
        organizationId: organization?.id,
      });

      const procurementRequisition =
        await this.repositoryProcurementRequisition.findOne({
          where: {
            id: timelines[0].procurementRequisitionId,
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
      const budgetPlanEndDate =
        procurementRequisition.postBudgetPlan.app.budgetYears.endDate;

      const budgetPlanStartDate =
        procurementRequisition.postBudgetPlan.app.budgetYears.startDate;

      timelines.forEach((element) => {
        element.organizationId = organization.id;
        element.organizationName = organization.name;
      });

      const ordered = timelines.sort((a, b) => a.order - b.order);
      if (
        new Date(ordered[0].dueDate).getTime() < budgetPlanStartDate.getTime()
      )
        throw new HttpException(
          'Start date must be greater than budget plan start date',
          430,
        );

      if (
        new Date(ordered[ordered.length - 1].dueDate).getTime() >
        budgetPlanEndDate.getTime()
      )
        throw new HttpException(
          'End date must be less than budget plan end date',
          430,
        );

      ordered.forEach((tl, index) => {
        const dueDate = new Date(tl.dueDate);

        if (index < ordered.length - 1) {
          if (index !== tl.order)
            throw new HttpException('Timeline order must be sequential', 430);

          const nextDueDate = new Date(ordered[index + 1].dueDate);

          // Assumed next due date is the current due date plus the next activity's period in days
          const assumedNextDueDate = dueDate;
          assumedNextDueDate.setDate(
            assumedNextDueDate.getDate() + Number(ordered[index + 1].period),
          );

          if (assumedNextDueDate.getTime() !== nextDueDate.getTime())
            throw new HttpException(
              'Timeline validation error. Due dates must be sequential with correct period difference',
              430,
            );
        }
      });

      const timeline = this.repositoryProcurementRequisitionTimeline.create(
        timelines as any,
      );
      await this.repositoryProcurementRequisitionTimeline.insert(timeline);
      return timelines;
    } catch (error) {
      throw error;
    }
  }
  // async bulkCreate(timelines: any[], user: any) {
  //   const organizationId = user?.organization?.id;
  //   const procurementRequisitionId = timelines[0].procurementRequisitionId;

  //   timelines.forEach((timeline) => {
  //     timeline.organizationId = organizationId;
  //   });

  //   const procurementRequisition =
  //     await this.repositoryProcurementRequisition.findOne({
  //       where: {
  //         id: procurementRequisitionId,
  //       },
  //       relations: {
  //         procurementRequisitionTimelines: true,
  //       },
  //     });
  //   if (procurementRequisition.isPlanned) {
  //     const checkAppDates = this.compareAppDueDates(
  //       procurementRequisition.procurementRequisitionTimelines,
  //       timelines,
  //     );
  //     if (!checkAppDates) {
  //       throw new HttpException('Invalid App Due Dates', 430);
  //     }
  //   }
  //   // Validate timelines
  //   const validationResult = this.validateTimelines(timelines);
  //   if (validationResult !== true) {
  //     throw new HttpException(validationResult, 430);
  //   }

  //   await this.repositoryProcurementRequisitionTimeline.delete({
  //     procurementRequisitionId,
  //     organizationId,
  //   });

  //   const timelineEntities =
  //     this.repositoryProcurementRequisitionTimeline.create(timelines);
  //   await this.repositoryProcurementRequisitionTimeline.insert(
  //     timelineEntities,
  //   );

  //   return timelines;
  // }

  // compareAppDueDates(
  //   procurementRequisitionTimelines: any[],
  //   timelines: any[],
  // ): boolean {
  //   for (let i = 0; i < procurementRequisitionTimelines.length; i++) {
  //     const dueDate = new Date(procurementRequisitionTimelines[i].appDueDate);
  //     const appDueDate = new Date(timelines[i].appDueDate);
  //     if (dueDate.getTime() !== appDueDate.getTime()) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  // validateTimelines(timelines: any[]) {
  //   const ordered = timelines.sort((a, b) => a.order - b.order);
  //   for (let i = 0; i < ordered.length - 1; i++) {
  //     const dueDate = new Date(ordered[i].dueDate);
  //     const nextDueDate = new Date(ordered[i + 1].dueDate);
  //     const assumedNextDueDate = new Date(dueDate);
  //     assumedNextDueDate.setDate(
  //       assumedNextDueDate.getDate() + Number(ordered[i + 1].period),
  //     );
  //     if (
  //       assumedNextDueDate.getTime() !== nextDueDate.getTime() ||
  //       i !== ordered[i].order
  //     ) {
  //       return 'Timeline validation error. Due dates must be sequential with correct period difference and order';
  //     }
  //   }

  //   return true;
  // }
}
