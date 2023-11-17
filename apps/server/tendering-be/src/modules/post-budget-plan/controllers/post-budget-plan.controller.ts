import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { PostBudgetPlan } from 'src/entities';
import { EntityCrudController } from 'src/shared/controller';
import {
  CreatePostBudgetPlanDto,
  UpdatePostBudgetPlanDto,
} from '../dto/post-budget-plan.dto';
import { PostBudgetPlanService } from '../services/post-budget-plan.service';

const options: EntityCrudOptions = {
  createDto: CreatePostBudgetPlanDto,
  updateDto: UpdatePostBudgetPlanDto,
};

@Controller('post-budget-plans')
@ApiTags('post-budget-plans')
export class PostBudgetPlanController extends EntityCrudController<PostBudgetPlan>(
  options,
) {
  constructor(private readonly postBudgetPlanService: PostBudgetPlanService) {
    super(postBudgetPlanService);
  }
}
