import { Controller } from '@nestjs/common';
import { BudgetCategoriesService } from '../services/budget-categories.service';
import { BudgetCategory } from '@entities';
import {
  EntityCrudController,
  ExtraCrudController,
} from '@generic-controllers';
import {
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'src/shared/types/crud-option.type';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';
import {
  CreateBudgetCategoryDto,
  UpdateBudgetCategoryDto,
} from '../dto/budget-category.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'budgetCategoryId',
  createDto: CreateBudgetCategoryDto,
  updateDto: UpdateBudgetCategoryDto,
};

@Controller('budget-categories')
@ApiTags('budget-categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class BudgetCategoriesController extends ExtraCrudController<BudgetCategory>(
  options,
) {
  constructor(private readonly categoriesService: BudgetCategoriesService) {
    super(categoriesService);
  }
}
