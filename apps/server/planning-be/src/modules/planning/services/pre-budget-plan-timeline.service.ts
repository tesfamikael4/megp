import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlanActivity, PreBudgetPlanTimeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { BulkTimelineDto } from '../dtos/pre-budget-plan-timeline.dto';

@Injectable()
export class PreBudgetPlanTimelineService extends ExtraCrudService<PreBudgetPlanTimeline> {
  constructor(
    @InjectRepository(PreBudgetPlanTimeline)
    private readonly repositoryPreBudgetPlanTimeline: Repository<PreBudgetPlanTimeline>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly repositoryPreBudgetPlanActivity: Repository<PreBudgetPlanActivity>,
  ) {
    super(repositoryPreBudgetPlanTimeline);
  }

  async getByActivityId(activityId) {
    return this.repositoryPreBudgetPlanTimeline.find({
      where: {
        preBudgetPlanActivityId: activityId,
      },
    });
  }

  async bulkCreate(timelines: BulkTimelineDto): Promise<BulkTimelineDto> {
    this.repositoryPreBudgetPlanTimeline.delete({
      preBudgetPlanActivityId: timelines.timeline[0].preBudgetPlanActivityId,
    });

    const timeline = this.repositoryPreBudgetPlanTimeline.create(
      timelines.timeline as any,
    );
    await this.repositoryPreBudgetPlanTimeline.insert(timeline);

    return timelines;
  }
}
