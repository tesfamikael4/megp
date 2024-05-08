import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanItem } from 'src/entities';
import { PostBudgetPlanItemService } from '../services/post-budget-plan-items.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BulkItemsDto } from 'src/modules/planning/dtos/pre-budget-plan-items.dto';
import { AllowAnonymous, CurrentUser } from 'src/shared/authorization';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { OnEvent } from '@nestjs/event-emitter';

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
  async bulkCreate(
    @Body() itemData: BulkItemsDto,
    @CurrentUser() user: any,
  ): Promise<BulkItemsDto> {
    return this.postBudgetPlanItemService.bulkCreate(
      itemData,
      user.organization,
    );
  }

  // TODO: this endpoint is only for PDE
  @AllowAnonymous()
  @Get('get-consolidate-items/:id')
  async getConsolidateItems(@Param('id') id: string) {
    return await this.postBudgetPlanItemService.getConsolidateItems(id);
  }

  @AllowAnonymous()
  @Get('get-by-item-code/:id')
  async getByItemCode(@Param('id') id: string) {
    return await this.postBudgetPlanItemService.getByItemCode(id);
  }

  @OnEvent('post.recalculateCalculatedAmountActivity')
  async recalculate(payload) {
    return await this.postBudgetPlanItemService.recalculateCalculatedAmount(
      payload.preBudgetPlanActivityId,
    );
  }
}
