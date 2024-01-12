import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementRequisitionMechanism } from 'src/entities';
import {
  CreateProcurementRequisitionMechanismDto,
  UpdateProcurementRequisitionMechanismDto,
} from '../dto/procurement-requisition-mechanism.dto';
import { ProcurementRequisitionMechanismService } from '../services/procurement-requisition-mechanism.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionMechanismDto,
  updateDto: UpdateProcurementRequisitionMechanismDto,
};

@Controller('procurement-requisition-mechanisms')
@ApiTags('procurement-requisition-mechanisms')
export class ProcurementRequisitionMechanismController extends ExtraCrudController<ProcurementRequisitionMechanism>(
  options,
) {
  constructor(
    private readonly ProcurementRequisitionMechanismService: ProcurementRequisitionMechanismService,
  ) {
    super(ProcurementRequisitionMechanismService);
  }
}
