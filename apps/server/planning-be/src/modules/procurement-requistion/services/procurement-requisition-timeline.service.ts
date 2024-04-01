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
          procurementRequisitionTimelines: true,
        },
      });
    // compare dueDates
    const checkAppDates = this.compareAppDueDates(
      procurementRequisition.procurementRequisitionTimelines,
      timelines,
    );
    if (!checkAppDates) {
      throw new HttpException('Invalid App Due Dates', 430);
    }
    // Validate timelines
    const validationResult = this.validateTimelines(timelines);
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
