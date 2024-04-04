import { AdhocTeam } from '@entities';
import { Body, Controller, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
  AdhocTeamChangeStatusDto,
  CreateAdhocTeamDto,
  UpdateAdhocTeamDto,
} from '../dto/adhoc-team.dto';
import { AdhocTeamService } from '../services/adhoc-team.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementInstitutionId',
  createDto: CreateAdhocTeamDto,
  updateDto: UpdateAdhocTeamDto,
};

@Controller('adhoc-team')
@ApiTags('adhoc-team')
export class AdhocTeamController extends ExtraCrudController<AdhocTeam>(
  options,
) {
  constructor(private readonly adhocTeamService: AdhocTeamService) {
    super(adhocTeamService);
  }

  @Put('change-status')
  async changeStatus(@Body() data: AdhocTeamChangeStatusDto) {
    return await this.adhocTeamService.changeStatus(data);
  }
}
