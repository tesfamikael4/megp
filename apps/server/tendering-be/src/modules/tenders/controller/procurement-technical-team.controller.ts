import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProcurementTechnicalTeam } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementTechnicalTeamService } from '../service/procurement-technical-team.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('procurement-technical-teams')
@ApiTags('Procurement Technical Team Controller')
export class ProcurementTechnicalTeamController extends ExtraCrudController<ProcurementTechnicalTeam>(
  options,
) {
  constructor(
    private readonly procurementTechnicalTeamService: ProcurementTechnicalTeamService,
  ) {
    super(procurementTechnicalTeamService);
  }
}
