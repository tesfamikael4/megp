import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionActivity } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementRequisitionActivityService } from '../services/procurement-requisition-activity.service';
import {
  AssignAnnualProcurementPlanActivityDto,
  UpdateProcurementRequisitionActivityDto,
} from '../dto/procurement-requisition-activity.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: AssignAnnualProcurementPlanActivityDto,
  updateDto: UpdateProcurementRequisitionActivityDto,
};

@Controller('procurement-requisition-activities')
@ApiTags('procurement-requisition-activities')
export class ProcurementRequisitionActivityController extends ExtraCrudController<ProcurementRequisitionActivity>(
  options,
) {
  constructor(
    private readonly procurementRequisitionActivityService: ProcurementRequisitionActivityService,
  ) {
    super(procurementRequisitionActivityService);
  }

  @Get('annualProcurementPlan')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  async annualProcurementPlan(@Query('q') q: string): Promise<any> {
    return this.procurementRequisitionActivityService.annualProcurementPlan(q);
  }

  @Get('fromPlanningTesting')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  async annualsProcurementPlan(@Query('q') q: string): Promise<any> {
    return this.procurementRequisitionActivityService.postBudgetPlan(q);
  }

  @Get('annualProcurementPlanActivities/:id')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  async annualProcurementPlanActivities(
    @Param('id') id: string,
    @Query('q') q: string,
  ): Promise<any> {
    return this.procurementRequisitionActivityService.annualProcurementPlanActivities(
      id,
      q,
    );
  }
}
