import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RfxProcurementMechanism } from 'src/entities';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';
import { RfxProcurementMechanismService } from '../services/rfx-procurement-mechanism.service';
import {
  CreateRfxProcurementMechanismsDto,
  UpdateRfxProcurementMechanismsDto,
} from '../dtos/rfx-procurement-method.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  // createDto: CreateRfxProcurementMechanismsDto,
  // updateDto: UpdateRfxProcurementMechanismsDto
};

@ApiBearerAuth()
@Controller('rfx-procurement-mechanisms')
@ApiTags('Rfx Procurement Mechanism Controller')
export class RfxProcurementMechanismController extends ExtraCrudController<RfxProcurementMechanism>(
  options,
) {
  constructor(
    private readonly procurementMechanismService: RfxProcurementMechanismService,
  ) {
    super(procurementMechanismService);
  }
}
