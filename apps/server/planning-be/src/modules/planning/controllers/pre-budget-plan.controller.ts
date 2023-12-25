import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlan } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import {
  CreatePreBudgetPlanDto,
  UpdatePreBudgetPlanDto,
} from '../dtos/pre-budget-plan.dto';
import { PreBudgetPlanService } from '../services/pre-budget-plan.service';
import { ExtraCrudController } from 'src/shared/controller';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { EventPattern } from '@nestjs/microservices';
import { TransactionInterceptor } from 'src/shared/interceptors';

const options: ExtraCrudOptions = {
  entityIdName: 'appid',
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
  async getPreBudgetWithApp(@Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return await this.preBudgetPlanService.findPreBudgetPlans(query);
  }

  @Post('approve-pre-budget/:id')
  @ApiPaginatedResponse(PreBudgetPlan)
  @UseInterceptors(TransactionInterceptor)
  async approvePreBudget(@Param('id') id: string) {
    return await this.preBudgetPlanService.copySelectedPreToPost(id);
  }

  @Get('get-analytics/:id')
  @ApiPaginatedResponse(PreBudgetPlan)
  async getAnalytics(@Param('id') id: string) {
    return await this.preBudgetPlanService.getAnalytics(id);
  }

  @Post('initiate-workflow')
  async initiateWorkflow() {
    await this.preBudgetPlanService.initateWorkflow();
  }

  @EventPattern('workflow-approved')
  async handleApprovedWorkflow() {
    // TODO: Handle Approved Workflow Here. This is initiated from the workflow applicaiton
    console.log(
      'Handle Approved Workflow Here. This is initiated from the workflow applicaiton',
    );
  }
}
