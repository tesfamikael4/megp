import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostBudgetPlanTimeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PostBudgetPlanTimelineService extends ExtraCrudService<PostBudgetPlanTimeline> {
  constructor(
    @InjectRepository(PostBudgetPlanTimeline)
    private readonly repositoryPostBudgetPlanTimeline: Repository<PostBudgetPlanTimeline>,
  ) {
    super(repositoryPostBudgetPlanTimeline);
  }
}
