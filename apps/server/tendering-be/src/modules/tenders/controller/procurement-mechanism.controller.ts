import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProcurementMechanism } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementMechanismService } from '../service/procurement-mechanism.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('procurement-mechanisms')
@ApiTags('Procurement Mechanism Controller')
export class ProcurementMechanismController extends ExtraCrudController<ProcurementMechanism>(
  options,
) {
  constructor(
    private readonly ProcurementMechanismService: ProcurementMechanismService,
  ) {
    super(ProcurementMechanismService);
  }
}
