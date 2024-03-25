import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlan } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { UpdatePreBudgetPlanDto } from '../dtos/pre-budget-plan.dto';
import { PreBudgetPlanService } from '../services/pre-budget-plan.service';
import { ExtraCrudController } from 'src/shared/controller';
import { EventPattern } from '@nestjs/microservices';
import { TransactionInterceptor } from 'src/shared/interceptors';
import { AllowAnonymous, CurrentUser } from 'src/shared/authorization';
import { EntityManager, getManager } from 'typeorm';

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

  @Post()
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
    return await this.preBudgetPlanService.findPreBudgetPlans(
      organizationId,
      q,
    );
  }

  @Post('approve-pre-budget/:id')
  @ApiPaginatedResponse(PreBudgetPlan)
  @UseInterceptors(TransactionInterceptor)
  async approvePreBudget(@Param('id') id: string, @Body() data: any) {
    console.log({ data });
    return await this.preBudgetPlanService.copySelectedPreToPost(data.itemId);
  }

  @Get(':id/target-group-percentage')
  async getTargetGroupPercentage(@Param('id') preBudgetPlanId: string) {
    return await this.preBudgetPlanService.calculateTargetGroupPercentage(
      preBudgetPlanId,
    );
  }

  @Get('get-analytics/:id')
  @ApiPaginatedResponse(PreBudgetPlan)
  async getAnalytics(@Param('id') id: string) {
    return await this.preBudgetPlanService.getAnalytics(id);
  }

  @Post('initiate-workflow')
  @UseInterceptors(TransactionInterceptor)
  async initiateWorkflow(@Body() data: any, @CurrentUser() user) {
    data.organizationId = user.organization.id;
    data.organizationName = user.organization.name;
    await this.preBudgetPlanService.initiateWorkflow(data);
  }

  @EventPattern('workflow-approval.preBudgetApproval')
  @ApiPaginatedResponse(PreBudgetPlan)
  // @UseInterceptors(TransactionInterceptor)
  async handleApprovedWorkflow(@Body() data: any) {
    return await this.preBudgetPlanService.copySelectedPreToPost(data);
  }

  @AllowAnonymous()
  @Get('hash/:id')
  @ApiPaginatedResponse(PreBudgetPlan)
  async hashData(@Param('id') id: string, @CurrentUser() user) {
    // const userId = 'user.userId';
    return await this.preBudgetPlanService.hashData(id);
  }

  @Post('approve-hash')
  @ApiPaginatedResponse(PreBudgetPlan)
  async hashMatch(@Body() hash, @CurrentUser() user): Promise<boolean> {
    return await this.preBudgetPlanService.hashMatch(hash.id, hash.hashData);
  }

  @Post('pdf-generate/:id/:itemName')
  async pdfGenerate(
    @Param('id') id: string,
    @Param('itemName') itemName: string,
    @Res() response,
    @CurrentUser() user: any,
  ) {
    const buffer = await this.preBudgetPlanService.pdfGenerator(id, itemName, {
      organizationId: user.organization.id,
      organizationName: user.organization.name,
    });
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="example.pdf"',
    );
    response.send(buffer);
  }
}
