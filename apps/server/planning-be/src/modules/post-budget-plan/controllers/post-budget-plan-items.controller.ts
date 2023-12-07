import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanItems } from 'src/entities';
import { PostBudgetPlanItemsService } from '../services/post-budget-plan-items.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('post-budget-plan-items')
@ApiTags('post-budget-plan-items')
export class PostBudgetPlanItemsController extends ExtraCrudController<PostBudgetPlanItems>(
  options,
) {
  constructor(
    private readonly postBudgetPlanItemsService: PostBudgetPlanItemsService,
  ) {
    super(postBudgetPlanItemsService);
  }
}
