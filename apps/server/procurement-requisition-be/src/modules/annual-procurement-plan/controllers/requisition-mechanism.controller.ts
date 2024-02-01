import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementMechanism } from 'src/entities';
import {
  CreateProcurementMechanismDto,
  UpdateProcurementMechanismDto,
} from '../dto/procurement-mechanism.dto';
import { ProcurementMechanismService } from '../services/procurement-mechanism.service';

const options: ExtraCrudOptions = {
  entityIdName: 'annualProcurementPlanActivityId',
  createDto: CreateProcurementMechanismDto,
  updateDto: UpdateProcurementMechanismDto,
};

@Controller('procurement-mechanisms')
@ApiTags('procurement-mechanisms')
export class ProcurementMechanismController extends ExtraCrudController<ProcurementMechanism>(
  options,
) {
  constructor(
    private readonly ProcurementMechanismService: ProcurementMechanismService,
  ) {
    super(ProcurementMechanismService);
  }
}
