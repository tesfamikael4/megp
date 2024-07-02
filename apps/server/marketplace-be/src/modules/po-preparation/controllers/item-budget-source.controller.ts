import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { ItemBudgetSource } from 'src/entities';
import { ItemBudgetSourceService } from '../services/item-budget-source.service';
import {
  CreateItemBudgetSourceDto,
  UpdateItemBudgetSourceDto,
} from '../dtos/item-budget-source.dto';
const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateItemBudgetSourceDto,
  updateDto: UpdateItemBudgetSourceDto,
};

@ApiBearerAuth()
@Controller('item-budget-sources')
@ApiTags('ItemBudgetSource')
export class ItemBudgetSourceController extends ExtraCrudController<ItemBudgetSource>(
  options,
) {
  constructor(
    private readonly itemBudgetSourceService: ItemBudgetSourceService,
  ) {
    super(itemBudgetSourceService);
  }
}
