import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
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
import { CurrentUser, JwtGuard } from 'src/shared/authorization';

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

  async create(
    @Body() itemData: PreBudgetPlan,
    @CurrentUser() user,
  ): Promise<PreBudgetPlan> {
    itemData.organizationId = user.organization.id;
    return this.preBudgetPlanService.create(itemData);
  }

  @Get('get-with-app')
  @ApiPaginatedResponse(PreBudgetPlan)
  async getPreBudgetWithApp(@Query('q') q: string, @CurrentUser() user) {
    const organizationId = user.organization.id;
    const query = decodeCollectionQuery(q);
    return await this.preBudgetPlanService.findPreBudgetPlans(
      organizationId,
      query,
    );
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
  @UseInterceptors(TransactionInterceptor)
  async initiateWorkflow(@Body() data: any) {
    await this.preBudgetPlanService.initiateWorkflow(data.name, data.id);
  }

  @EventPattern('workflow-approved')
  @ApiPaginatedResponse(PreBudgetPlan)
  @UseInterceptors(TransactionInterceptor)
  async handleApprovedWorkflow(@Body() data: any) {
    return await this.preBudgetPlanService.copySelectedPreToPost(data);
  }
}
