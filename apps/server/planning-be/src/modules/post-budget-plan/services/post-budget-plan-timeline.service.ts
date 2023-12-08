import { InjectRepository } from '@nestjs/typeorm';
import { Body, Injectable, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostBudgetPlanTimeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { BulkTimelineDto } from '../dtos/post-budget-plan-timeline.dto';

@Injectable()
export class PostBudgetPlanTimelineService extends ExtraCrudService<PostBudgetPlanTimeline> {
  constructor(
    @InjectRepository(PostBudgetPlanTimeline)
    private readonly repositoryPostBudgetPlanTimeline: Repository<PostBudgetPlanTimeline>,
  ) {
    super(repositoryPostBudgetPlanTimeline);
  }

  async bulkCreate(timelines: BulkTimelineDto): Promise<BulkTimelineDto> {
    this.repositoryPostBudgetPlanTimeline.delete({
      postBudgetPlanActivityId: timelines.timeline[0].postBudgetPlanActivityId,
    });

    const timeline = this.repositoryPostBudgetPlanTimeline.create(
      timelines.timeline as any,
    );
    await this.repositoryPostBudgetPlanTimeline.insert(timeline);

    return timelines;
  }
}
