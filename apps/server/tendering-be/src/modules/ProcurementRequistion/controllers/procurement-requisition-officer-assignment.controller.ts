import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionOfficerAssignment } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateProcurementRequisitionOfficerAssignmentDto,
  UpdateProcurementRequisitionOfficerAssignmentDto,
} from '../dto/procurement-requisition-officer-assignment.dto';
import { ProcurementRequisitionOfficerAssignmentService } from '../services/procurement-requisition-officer-assignment.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionOfficerAssignmentDto,
  updateDto: UpdateProcurementRequisitionOfficerAssignmentDto,
};

@Controller('procurement-requisition-officer-assignments')
@ApiTags('procurement-requisition-officer-assignments')
export class ProcurementRequisitionOfficerAssignmentController extends ExtraCrudController<ProcurementRequisitionOfficerAssignment>(
  options,
) {
  constructor(
    private readonly procurementRequisitionOfficerAssignmentService: ProcurementRequisitionOfficerAssignmentService,
  ) {
    super(procurementRequisitionOfficerAssignmentService);
  }
}
