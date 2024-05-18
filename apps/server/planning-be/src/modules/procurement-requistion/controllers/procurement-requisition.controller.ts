import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionService } from '../services/procurement-requisition.service';
import {
  CreateProcurementRequisitionDto,
  UpdateProcurementRequisitionDto,
} from '../dto/procurement-requisition.dto';
import { ProcurementRequisition } from 'src/entities';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import {
  AllowAnonymous,
  ApiKeyGuard,
  CurrentUser,
} from 'src/shared/authorization';
import { TransactionInterceptor } from 'src/shared/interceptors';
import { EventPattern } from '@nestjs/microservices';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: EntityCrudOptions = {
  createDto: CreateProcurementRequisitionDto,
  updateDto: UpdateProcurementRequisitionDto,
};

@Controller('procurement-requisitions')
@ApiTags('procurement-requisitions')
export class ProcurementRequisitionController extends EntityCrudController<ProcurementRequisition>(
  options,
) {
  constructor(
    private readonly procurementRequisitionService: ProcurementRequisitionService,
  ) {
    super(procurementRequisitionService);
  }
  @Post('initiate-workflow')
  @UseInterceptors(TransactionInterceptor)
  async initiateWorkflow(@Body() data: any, @CurrentUser() user: any) {
    data.organizationId = user.organization.id;
    data.organizationName = user.organization.name;
    return await this.procurementRequisitionService.initiateWorkflow(data);
  }
  @EventPattern('workflow-approval.procurementRequisition')
  @ApiPaginatedResponse(ProcurementRequisition)
  async handleApprovedWorkflow(@Body() data: any) {
    return await this.procurementRequisitionService.prApprovalDecision(data);
  }

  @Post('pr-from-app')
  async selectFromAPP(@Body() itemData: any, @CurrentUser() user: any) {
    return await this.procurementRequisitionService.selectFromAPP(
      itemData,
      user,
    );
  }

  @Get('get-analytics/:id')
  @ApiPaginatedResponse(ProcurementRequisition)
  async getAnalytics(@Param('id') id: string) {
    return await this.procurementRequisitionService.getAnalytics(id);
  }

  @Get(':id/target-group-percentage')
  async getTargetGroupPercentage(@Param('id') preBudgetPlanId: string) {
    return await this.procurementRequisitionService.calculateTargetGroupPercentage(
      preBudgetPlanId,
    );
  }

  @Get('get-current-budgets')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @ApiPaginatedResponse(ProcurementRequisition)
  async getCurrentBudgetYear(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.procurementRequisitionService.getCurrentBudget(query);
  }

  //for tendering
  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  @Get('get-procurement-requisition/:id')
  @ApiPaginatedResponse(ProcurementRequisition)
  async getProcurementRequisitionByReference(@Param('id') id: string) {
    return await this.procurementRequisitionService.getProcurementRequisitionById(
      id,
    );
  }

  @Get('get-procurement-requisitions-for-tenders')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getProcurementRequisitions(
    @Query('q') q?: string,
    @CurrentUser() user?: any,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.procurementRequisitionService.getProcurementRequisitions(
      query,
      user,
    );
  }

  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  @Get('procurement-requisition-status/:id')
  @ApiPaginatedResponse(ProcurementRequisition)
  async getProcurementRequisitionStatus(
    @Query('q') q?: string,
    @Req() req?: any,
  ) {
    const query = decodeCollectionQuery(q);
    return this.procurementRequisitionService.getProcurementRequisitionStatus(
      query,
    );
  }
}
