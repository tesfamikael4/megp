import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlanItems } from 'src/entities';
import { PreBudgetPlanItemsService } from '../services/pre-budget-plan-items.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

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
}
