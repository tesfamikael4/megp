import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostBudgetPlanActivity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PostBudgetPlanActivityService extends ExtraCrudService<PostBudgetPlanActivity> {
  constructor(
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
  ) {
    super(repositoryPostBudgetPlanActivity);
  }
}
