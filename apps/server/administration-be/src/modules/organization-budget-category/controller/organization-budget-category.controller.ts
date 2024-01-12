import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from '@api-data';
import { ExtraCrudController } from '@generic-controllers';
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
  async bulkCreate(@Body() budgetData: OrganizationBudgetCategoryCreateDto) {
    try {
      console.log({ budgetData });
      const createdBudgets =
        await this.organizationBudgetCategoryService.bulkCreate(budgetData);
      return { success: true, data: createdBudgets };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':organizationId')
  async getBudgetCategoriesByOrganizationId(
    @Param('organizationId') organizationId: string,
  ) {
    try {
      return await this.organizationBudgetCategoryService.getBudgetCategoryByOrganizationId(
        organizationId,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get budgets',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
