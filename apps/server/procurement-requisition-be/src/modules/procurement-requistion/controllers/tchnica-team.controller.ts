import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TechnicalTeam } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateTechnicalTeamDto,
  UpdateTechnicalTeamDto,
} from '../dto/technical-team.dto';
import { TechnicalTeamService } from '../services/technical-team.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateTechnicalTeamDto,
  updateDto: UpdateTechnicalTeamDto,
};

@Controller('technical-teams')
@ApiTags('technical-teams')
export class TechnicalTeamController extends ExtraCrudController<TechnicalTeam>(
  options,
) {
  constructor(private readonly technicalTeamService: TechnicalTeamService) {
    super(technicalTeamService);
  }
}
