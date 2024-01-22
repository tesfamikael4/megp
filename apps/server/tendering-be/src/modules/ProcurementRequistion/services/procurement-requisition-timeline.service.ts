import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcurementRequisition,
  ProcurementRequisitionTimeline,
} from 'src/entities';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateProcurementRequisitionTimelineDto } from '../dto/procurement-requisition-timeline.dto';

const extraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
};
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
  @OnEvent('create.pr_timelines', { async: true })
  async handleTimelinesCreatedEvent(
    timelinesData: CreateProcurementRequisitionTimelineDto[],
  ): Promise<void> {
    const mergeTimelines = await this.mergeSimilarTimelines(timelinesData);
    const batchSize = 50;
    for (let i = 0; i < mergeTimelines.length; i += batchSize) {
      const batch = mergeTimelines.slice(i, i + batchSize);
      const timelines =
        this.repositoryProcurementRequisitionTimeline.create(batch);
      await this.repositoryProcurementRequisitionTimeline.save(timelines);
    }
  }

  async create(timelineData: any, req?: any): Promise<any> {
    const query = decodeCollectionQuery(null);
    const response = await super.findAll(
      timelineData[0].procurementRequisitionId,
      query,
      extraCrudOptions,
      req,
    );

    const timelines = [...response.items, ...timelineData];
    const flattenedArray = timelines.flat();
    const mergeTimelines = await this.mergeSimilarTimelines(flattenedArray);

    const result = await this.repositoryProcurementRequisitionTimeline.save(
      this.repositoryProcurementRequisitionTimeline.create(mergeTimelines),
    );

    return result;
  }

  async mergeSimilarTimelines(timelines: any[]) {
    const mergedTimelines: any[] = [];

    timelines.sort((a, b) => a.dueDate - b.dueDate);
    const lastTimeline = timelines[timelines.length - 1];

    let currentTimeline: any | null = null;

    for (const timeline of timelines) {
      timeline.noOfDays = timeline.period;
      if (!currentTimeline) {
        // First timeline, add to mergedTimelines
        currentTimeline = { ...timeline };
        mergedTimelines.push(currentTimeline);
      } else if (timeline.timeline == lastTimeline.timeline) {
        // Last timeline, add to mergedTimelines
        currentTimeline = { ...timeline };
        mergedTimelines.push(currentTimeline);
        break;
      } else {
        // Check if the due date is greater than or equal to the previous timeline's due date
        const dueDate = await this.dateCalculator(
          new Date(timeline.dueDate),
          timeline.period,
          'add',
        );
        const currentDueDate = await this.dateCalculator(
          new Date(currentTimeline.dueDate),
          currentTimeline.period,
          'add',
        );
        const dueDateValid = new Date(dueDate) > new Date(currentDueDate);
        const timelineName = timeline.timeline == currentTimeline.timeline;

        if (!timelineName) {
          // Add a new timeline to mergedTimelines
          currentTimeline = { ...timeline };
          mergedTimelines.push(currentTimeline);
        }
      }
    }

    return mergedTimelines;
  }

  async dateCalculator(
    date: Date,
    days: number,
    operator: string,
  ): Promise<Date> {
    const futureDate = new Date(date);
    if (operator === 'add') {
      futureDate.setDate(date.getDate() + days);
    }

    return futureDate;
  }
}
