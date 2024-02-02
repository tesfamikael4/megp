import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
