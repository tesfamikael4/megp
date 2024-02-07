import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdAdministrativeCompliance } from 'src/entities';
import { SpdAdministrativeComplianceService } from '../service/spd-administrative-compliance.service';
import {
  CreateSpdAdministrativeCompliancesDto,
  UpdateSpdAdministrativeCompliancesDto,
} from '../dto/spd-administrative-compliance.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdAdministrativeCompliancesDto,
  updateDto: UpdateSpdAdministrativeCompliancesDto,
};
@ApiBearerAuth()
@Controller('spd-administrative-compliances')
@ApiTags('Spd-Administrative-ComplianceController')
export class SpdAdministrativeComplianceController extends EntityCrudController<SpdAdministrativeCompliance>(
  options,
) {
  constructor(
    private readonly spdAdministrativeComplianceService: SpdAdministrativeComplianceService,
  ) {
    super(spdAdministrativeComplianceService);
  }
}
