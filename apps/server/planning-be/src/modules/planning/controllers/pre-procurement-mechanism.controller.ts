import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { PreProcurementMechanism } from 'src/entities';
import { PreProcurementMechanismService } from '../services/pre-procurement-mechanism.service';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-procurement-mechanism')
@ApiTags('pre-procurement-mechanism')
export class PreProcurementMechanismController extends ExtraCrudController<PreProcurementMechanism>(
  options,
) {
  constructor(
    private readonly preProcurementMechanismService: PreProcurementMechanismService,
  ) {
    super(preProcurementMechanismService);
  }
}
