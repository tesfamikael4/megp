import { Controller } from '@nestjs/common';
import { BudgetCategoriesService } from '../services/budget-categories.service';
import { BudgetCreateCategoryDto } from '../dto/budget-create-category.dto';
import { BudgetCategory } from '@entities';
import { EntityCrudController } from '@generic-controllers';
import { BudgetUpdateCategoryDto } from '../dto/budget-update-category.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';
const options: EntityCrudOptions = {
  createDto: BudgetCreateCategoryDto,
  updateDto: BudgetUpdateCategoryDto,
};
@Controller('budget-categories')
@ApiTags('budget-categories')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class BudgetCategoriesController extends EntityCrudController<BudgetCategory>(
  options,
) {
  constructor(private readonly categoriesService: BudgetCategoriesService) {
    super(categoriesService);
  }
}
