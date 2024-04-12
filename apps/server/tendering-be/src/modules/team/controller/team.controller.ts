import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Team } from 'src/entities/team.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TeamService } from '../service/team.service';
import { CreateTeamDto } from '../dto/team.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateTeamDto,
};

@Controller('teams')
@ApiTags('Teams Controller')
export class TeamController extends ExtraCrudController<Team>(options) {
  constructor(private readonly teamService: TeamService) {
    super(teamService);
  }

  @Get('getByTenderId/:tenderId')
  @ApiOperation({
    summary: 'Warning: do not use this endpoint',
    description: 'This endpoint retrieves random teams.',
  })
  async getByTenderId(@Param('tenderId') tenderId: string, @Req() req) {
    return await this.teamService.getByTenderId(tenderId, req);
  }
}
