import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';
import {
  EntityCrudController,
  ExtraCrudController,
} from '@generic-controllers';
import { OrganizationBudgetCategoryService } from '../service/organization-budget-category.service';
import { OrganizationBudgetCategory } from 'src/entities/organization-budget-category.entity';
import {
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'src/shared/types/crud-option.type';
import {
  OrganizationBudgetCategoryCreateDto,
  OrganizationBudgetCategoryUpdateDto,
} from '../dto/organization-budget-category.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'budgetCategoryId',
  createDto: OrganizationBudgetCategoryCreateDto,
  updateDto: OrganizationBudgetCategoryUpdateDto,
};

@Controller('organization-budget-category')
@ApiTags('organization-budget-category')
@ApiExtraModels(DataResponseFormat)
export class OrganizationBudgetCategoryController extends ExtraCrudController<OrganizationBudgetCategory>(
  options,
) {
  constructor(
    private readonly organizationBudgetCategoryService: OrganizationBudgetCategoryService,
  ) {
    super(organizationBudgetCategoryService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() budgetData: OrganizationBudgetCategoryCreateDto,
  ): Promise<any> {
    try {
      console.log({ budgetData });
      const createdBudgets =
        await this.organizationBudgetCategoryService.bulkCreate(budgetData);
      return { success: true, data: createdBudgets };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
