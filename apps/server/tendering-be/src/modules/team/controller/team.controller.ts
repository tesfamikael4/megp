import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Team } from 'src/entities/team.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TeamService } from '../service/team.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@Controller('teams')
@ApiTags('Teams Controller')
export class TeamController extends ExtraCrudController<Team>(options) {
  constructor(private readonly teamService: TeamService) {
    super(teamService);
  }
}
