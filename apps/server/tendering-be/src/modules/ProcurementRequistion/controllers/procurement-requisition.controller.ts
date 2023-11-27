import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionService } from '../services/procurement-requisition.service';
import {
  CreateProcurementRequisitionDto,
  UpdateProcurementRequisitionDto,
} from '../dto/procurement-requisition.dto';
import { ProcurementRequisition } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanId',
  createDto: CreateProcurementRequisitionDto,
  updateDto: UpdateProcurementRequisitionDto,
};

@Controller('procurement-requisitions')
@ApiTags('procurement-requisitions')
export class ProcurementRequisitionController extends ExtraCrudController<ProcurementRequisition>(
  options,
) {
  constructor(
    private readonly procurementRequisitionService: ProcurementRequisitionService,
  ) {
    super(procurementRequisitionService);
  }
}
