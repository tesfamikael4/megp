import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlan } from 'src/entities';
import { PreBudgetPlanService } from '../services/pre-budget-plan.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import {
  CreatePreBudgetPlanDto,
  UpdatePreBudgetPlanDto,
} from '../dtos/pre-budget-plan.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'appid',
  createDto: CreatePreBudgetPlanDto,
  updateDto: UpdatePreBudgetPlanDto,
};

@Controller('pre-budget-plans')
@ApiTags('pre-budget-plans')
export class PreBudgetPlanController extends ExtraCrudController<PreBudgetPlan>(
  options,
) {
  constructor(private readonly preBudgetPlanService: PreBudgetPlanService) {
    super(preBudgetPlanService);
  }

  @Get('get-with-app')
  @ApiPaginatedResponse(PreBudgetPlan)
  async getMandatesToAssign(@Query() query: CollectionQuery) {
    return await this.preBudgetPlanService.findPreBudgetPlans(query);
  }
}
