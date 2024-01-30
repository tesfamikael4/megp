import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequisitionerAssignment } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateRequisitionerAssignmentDto,
  UpdateRequisitionerAssignmentDto,
} from '../dto/requisitioner-assignment.dto';
import { RequisitionerAssignmentService } from '../services/requisitioner-assignment.service';

const options: ExtraCrudOptions = {
  entityIdName: 'annualProcurementPlanActivityId',
  createDto: CreateRequisitionerAssignmentDto,
  updateDto: UpdateRequisitionerAssignmentDto,
};

@Controller('procurement-requisition-officer-assignments')
@ApiTags('procurement-requisition-officer-assignments')
export class RequisitionerAssignmentController extends ExtraCrudController<RequisitionerAssignment>(
  options,
) {
  constructor(
    private readonly annualProcurementPlanOfficerAssignmentService: RequisitionerAssignmentService,
  ) {
    super(annualProcurementPlanOfficerAssignmentService);
  }
}
