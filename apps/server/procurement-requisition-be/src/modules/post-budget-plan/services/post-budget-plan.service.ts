import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { PostBudgetPlan } from 'src/entities';

@Injectable()
export class PostBudgetPlanService extends EntityCrudService<PostBudgetPlan> {
  constructor(
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,
  ) {
    super(repositoryPostBudgetPlan);
  }
}
