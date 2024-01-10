import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';
import { EntityCrudController } from '@generic-controllers';
import { OrganizationBudgetCategoryService } from '../service/organization-budget-category.service';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  OrganizationBudgetCategoryCreateDto,
  OrganizationBudgetCategoryUpdateDto,
} from '../dto/organization-budget-category.dto';

const options: EntityCrudOptions = {
  createDto: OrganizationBudgetCategoryCreateDto,
  updateDto: OrganizationBudgetCategoryUpdateDto,
};

@Controller('organization-budget-category')
@ApiTags('organization-budget-category')
@ApiExtraModels(DataResponseFormat)
export class OrganizationBudgetCategoryController extends EntityCrudController<OrganizationBudgetCategory>(
  options,
) {
  constructor(
    private readonly organizationBudgetCategoryService: OrganizationBudgetCategoryService,
  ) {
    super(organizationBudgetCategoryService);
  }
}
