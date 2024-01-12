import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionDisbursement } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateProcurementRequisitionDisbursementDto,
  UpdateProcurementRequisitionDisbursementDto,
} from '../dto/procurement-requisition-disbursement.dto';
import { ProcurementRequisitionDisbursementService } from '../services/procurement-requisition-disbursement.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionDisbursementDto,
  updateDto: UpdateProcurementRequisitionDisbursementDto,
};

@Controller('procurement-requisition-disbursements')
@ApiTags('procurement-requisition-disbursements')
export class ProcurementRequisitionDisbursementController extends ExtraCrudController<ProcurementRequisitionDisbursement>(
  options,
) {
  constructor(
    private readonly procurementRequisitionDisbursementService: ProcurementRequisitionDisbursementService,
  ) {
    super(procurementRequisitionDisbursementService);
  }
}
