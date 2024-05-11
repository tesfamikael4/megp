import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { RfxProcurementTechnicalTeamService } from '../services/rfx-procurement-technical-team.service';
import { RfxProcurementTechnicalTeam } from 'src/entities';
import {
  CreateRfxProcurementTechnicalTeamDto,
  UpdateRfxProcurementTechnicalTeamDto,
} from '../dtos/rfx-technical-team.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRfxProcurementTechnicalTeamDto,
  updateDto: UpdateRfxProcurementTechnicalTeamDto,
};

@ApiBearerAuth()
@Controller('rfx-procurement-technical-teams')
@ApiTags('Rfx Procurement Technical Team Controller')
export class RfxProcurementTechnicalTeamController extends ExtraCrudController<RfxProcurementTechnicalTeam>(
  options,
) {
  constructor(
    private readonly rfxProcurementTechnicalTeamService: RfxProcurementTechnicalTeamService,
  ) {
    super(rfxProcurementTechnicalTeamService);
  }
}
