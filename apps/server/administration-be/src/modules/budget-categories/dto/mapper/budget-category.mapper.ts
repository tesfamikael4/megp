import { BudgetCategory } from '@entities';
import { BudgetCreateCategoryDto } from '../budget-create-category.dto';
import { BudgetUpdateCategoryDto } from '../budget-update-category.dto';

export class CategoryMapper {
  static toEntity(
    dto: BudgetCreateCategoryDto | BudgetUpdateCategoryDto,
  ): BudgetCategory {
    const entity = new BudgetCategory();
    if ('id' in dto) {
      entity.id = dto.id;
    }
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }
}
