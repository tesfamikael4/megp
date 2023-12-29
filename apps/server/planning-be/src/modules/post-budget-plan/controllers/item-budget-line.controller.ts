import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemBudgetLine } from 'src/entities';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import {
  ExtraCrudController,
  RelationCrudController,
} from 'src/shared/controller';
import { ItemBudgetLineService } from '../services/item-budget-line.service';

const options: RelationCrudOptions = {
  firstEntityIdName: 'activityBudgetLineId',
  firstInclude: 'postBudgetPlanItems',
  secondEntityIdName: 'postBudgetPlanItemsId',
  secondInclude: 'activityBudgetLine',
};

@Controller('item-budget-lines')
@ApiTags('item-budget-lines')
export class ItemBudgetLineController extends RelationCrudController<ItemBudgetLine>(
  options,
) {
  constructor(private readonly itemBudgetLineService: ItemBudgetLineService) {
    super(itemBudgetLineService);
  }
}
