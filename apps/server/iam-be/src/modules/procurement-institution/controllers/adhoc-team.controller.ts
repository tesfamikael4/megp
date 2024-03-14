import { AdhocTeam } from '@entities';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { CreateAdhocTeamDto, UpdateAdhocTeamDto } from '../dto/adhoc-team.dto';
import { AdhocTeamService } from '../services/adhoc-team.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementInstitutionId',
  createDto: CreateAdhocTeamDto,
  updateDto: UpdateAdhocTeamDto,
};

@Controller('AdhocTeams')
@ApiTags('AdhocTeams')
export class AdhocTeamController extends ExtraCrudController<AdhocTeam>(
  options,
) {
  constructor(private readonly AdhocTeamService: AdhocTeamService) {
    super(AdhocTeamService);
  }
}
