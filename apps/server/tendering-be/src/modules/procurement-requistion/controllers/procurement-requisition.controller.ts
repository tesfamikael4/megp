import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionService } from '../services/procurement-requisition.service';
import {
  CreateProcurementRequisitionDto,
  UpdateProcurementRequisitionDto,
} from '../dto/procurement-requisition.dto';
import { ProcurementRequisition } from 'src/entities';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';

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
}
