import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanActivity } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { PostBudgetPlanActivityService } from '../services/post-budget-plan-activity.service copy';
import {
  CreatePostBudgetPlanDto,
  UpdatePostBudgetPlanDto,
} from '../dto/post-budget-plan.dto';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanId',
  createDto: CreatePostBudgetPlanDto,
  updateDto: UpdatePostBudgetPlanDto,
};

@Controller('post-budget-plan-activities')
@ApiTags('post-budget-plan-activities')
export class PostBudgetPlanActivityController extends ExtraCrudController<PostBudgetPlanActivity>(
  options,
) {
  constructor(
    private readonly postBudgetPlanActivityService: PostBudgetPlanActivityService,
  ) {
    super(postBudgetPlanActivityService);
  }
}
