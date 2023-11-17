import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionService } from '../services/procurement-requisition.service';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import {
  CreateProcurementRequisitionDto,
  UpdateProcurementRequisitionDto,
} from '../dto/procurement-requisition.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementRequisition } from 'src/entities';

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
