import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionTimeline,
} from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import { BulkTimelineDto } from '../dto/procurement-requisition-timeline.dto';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ProcurementRequisitionTimelineService extends ExtraCrudService<ProcurementRequisitionTimeline> {
  constructor(
    @InjectRepository(ProcurementRequisitionTimeline)
    private readonly repositoryProcurementRequisitionTimeline: Repository<ProcurementRequisitionTimeline>,
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,

    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryProcurementRequisitionTimeline);
  }

  async bulkCreate(timelines: any[], user: any): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];
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
          procurementRequisitionTimelines: true,
          budgetYear: true,
        },
      });
    if (procurementRequisition.isPlanned) {
      const checkAppDates = this.compareAppDueDates(
        procurementRequisition.procurementRequisitionTimelines,
        timelines,
      );
      if (!checkAppDates) {
        throw new HttpException('Invalid App Due Dates', 430);
      }
    }
    // Validate timelines
    const validationResult = this.validateTimelines(timelines);
    if (validationResult !== true) {
      throw new HttpException(validationResult, 430);
    }
    await entityManager.getRepository(ProcurementRequisitionTimeline).delete({
      procurementRequisitionId,
      organizationId,
    });

    // validate budget
    const budgetPlanEndDate = procurementRequisition.budgetYear.endDate;
    const budgetPlanStartDate = procurementRequisition.budgetYear.startDate;

    if (
      new Date(timelines[0].dueDate).getTime() < budgetPlanStartDate.getTime()
    )
      throw new HttpException(
        'Start date must be greater than budget plan start date',
        430,
      );

    if (
      new Date(timelines[timelines.length - 1].dueDate).getTime() >
      budgetPlanEndDate.getTime()
    )
      throw new HttpException(
        'End date must be less than budget plan end date',
        430,
      );

    const timelineEntities =
      this.repositoryProcurementRequisitionTimeline.create(timelines);

    await entityManager
      .getRepository(ProcurementRequisitionTimeline)
      .insert(timelineEntities);
    return timelines;
  }

  compareAppDueDates(
    procurementRequisitionTimelines: any[],
    timelines: any[],
  ): boolean {
    for (let i = 0; i < procurementRequisitionTimelines.length; i++) {
      const dueDate = new Date(procurementRequisitionTimelines[i].appDueDate);
      const appDueDate = new Date(timelines[i].appDueDate);
      if (dueDate.getTime() !== appDueDate.getTime()) {
        return false;
      }
    }
    return true;
  }

  validateTimelines(timelines: any[]) {
    const ordered = timelines.sort((a, b) => a.order - b.order);
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
