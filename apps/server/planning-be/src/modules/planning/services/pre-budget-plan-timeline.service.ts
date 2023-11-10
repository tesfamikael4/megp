import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlanTimeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PreBudgetPlanTimelineService extends ExtraCrudService<PreBudgetPlanTimeline> {
  constructor(
    @InjectRepository(PreBudgetPlanTimeline)
    private readonly repositoryPreBudgetPlanTimeline: Repository<PreBudgetPlanTimeline>,
  ) {
    super(repositoryPreBudgetPlanTimeline);
  }
}
