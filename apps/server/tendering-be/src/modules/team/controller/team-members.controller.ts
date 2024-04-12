import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TeamMember } from 'src/entities/team-member.entity';
import { TeamMembersService } from '../service/team-members.service';
import {
  BulkCreateWithTeamDto,
  BulkTeamMemberDto,
  CreateByTenderIdDto,
  CreateTeamMemberDto,
} from '../dto/team-member.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'teamId',
  createDto: CreateTeamMemberDto,
};

@Controller('team-members')
@ApiTags('Team Members Controller')
export class TeamMembersController extends ExtraCrudController<TeamMember>(
  options,
) {
  constructor(private readonly teamMembersService: TeamMembersService) {
    super(teamMembersService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() members: BulkTeamMemberDto,
    @Req() req: any,
  ): Promise<any> {
    return this.teamMembersService.bulkCreate(members, req);
  }

  @Post('bulk-create-with-team')
  async bulkCreateWithTeam(
    @Body() members: BulkCreateWithTeamDto,
    @Req() req: any,
  ): Promise<any> {
    return this.teamMembersService.bulkCreateWithTeam(members, req);
  }

  @Post('create-by-tenderId')
  async createByTender(
    @Body() members: CreateByTenderIdDto,
    @Req() req: any,
  ): Promise<any> {
    return this.teamMembersService.createByTenderId(members, req);
  }
}
