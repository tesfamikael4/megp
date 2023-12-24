import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanItem } from 'src/entities';
import { PostBudgetPlanItemService } from '../services/post-budget-plan-items.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BulkItemsDto } from 'src/modules/planning/dtos/pre-budget-plan-items.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('post-budget-plan-items')
@ApiTags('post-budget-plan-items')
export class PostBudgetPlanItemController extends ExtraCrudController<PostBudgetPlanItem>(
  options,
) {
  constructor(
    private readonly postBudgetPlanItemService: PostBudgetPlanItemService,
  ) {
    super(postBudgetPlanItemService);
  }

  @Post('bulk-create')
  async bulkCreate(@Body() itemData: BulkItemsDto): Promise<BulkItemsDto> {
    return this.postBudgetPlanItemService.bulkCreate(itemData);
  }
}
