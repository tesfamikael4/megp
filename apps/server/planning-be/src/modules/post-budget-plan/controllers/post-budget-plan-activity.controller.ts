import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanActivity } from 'src/entities';
import { PostBudgetPlanActivityService } from '../services/post-budget-plan-activity.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanId',
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
