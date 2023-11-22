import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlanItems } from 'src/entities';
import { PreBudgetPlanItemsService } from '../services/pre-budget-plan-items.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BulkItemsDto } from '../dtos/pre-budget-plan-items.dto';

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
  async bulkCreate(@Body() itemData: BulkItemsDto): Promise<BulkItemsDto> {
    return this.preBudgetPlanItemsService.bulkCreate(itemData);
  }
}
