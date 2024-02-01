import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlanItems } from 'src/entities';
import { PreBudgetPlanItemsService } from '../services/pre-budget-plan-items.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BulkItemsDto } from '../dtos/pre-budget-plan-items.dto';
import { ExtraCrudController } from 'src/shared/controller';
import { OnEvent } from '@nestjs/event-emitter';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-budget-plan-items')
@ApiTags('pre-budget-plan-items')
export class PreBudgetPlanItemsController extends ExtraCrudController<PreBudgetPlanItems>(
  options,
) {
  constructor(
    private readonly preBudgetPlanItemsService: PreBudgetPlanItemsService,
  ) {
    super(preBudgetPlanItemsService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() itemData: BulkItemsDto,
    @Req() req?: any,
  ): Promise<BulkItemsDto> {
    return this.preBudgetPlanItemsService.bulkCreate(itemData, req);
  }

  @Get('code-generate')
  async codeGenerate(): Promise<string> {
    return this.preBudgetPlanItemsService.codeGenerate();
  }

  @OnEvent('pre.recalculateCalculatedAmountActivity')
  async recalculate(payload) {
    return await this.preBudgetPlanItemsService.recalculateCalculatedAmount(
      payload.preBudgetPlanActivityId,
    );
  }
}
