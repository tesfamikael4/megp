import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionService } from '../services/procurement-requisition.service';
import {
  CreateProcurementRequisitionDto,
  UpdateProcurementRequisitionDto,
} from '../dto/procurement-requisition.dto';
import { ProcurementRequisition } from 'src/entities';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { CurrentUser } from 'src/shared/authorization';
import { TransactionInterceptor } from 'src/shared/interceptors';
import { EventPattern } from '@nestjs/microservices';
import { ApiPaginatedResponse } from 'src/shared/api-data';

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
  async initiateWorkflow(@Body() data: any): Promise<boolean> {
    // data.organizationId = user.organization.id;
    return await this.procurementRequisitionService.initiateWorkflow(data);
  }
  @EventPattern('workflow-approval.prApproval')
  @ApiPaginatedResponse(ProcurementRequisition)
  async handleApprovedWorkflow(@Body() data: any) {
    return await this.procurementRequisitionService.prApprovalDecision(data);
  }
}
