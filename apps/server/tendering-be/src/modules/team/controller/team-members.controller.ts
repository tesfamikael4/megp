import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TeamMember } from 'src/entities/team-member.entity';
import { TeamMembersService } from '../service/team-members.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@Controller('team-members')
@ApiTags('Team Members Controller')
export class TeamMembersController extends ExtraCrudController<TeamMember>(
  options,
) {
  constructor(private readonly teamMembersService: TeamMembersService) {
    super(teamMembersService);
  }
}
