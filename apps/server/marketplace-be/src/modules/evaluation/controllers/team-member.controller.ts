import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { TeamMember } from 'src/entities';
import { TeamMemberService } from '../services/team-member.service';
import { CreateTeamMemberDto } from '../dtos/team-member.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateTeamMemberDto,
};

@ApiBearerAuth()
@Controller('team-members')
@ApiTags('Team Members Controller')
export class TeamMemberController extends ExtraCrudController<TeamMember>(
  options,
) {
  constructor(private readonly teamMemberService: TeamMemberService) {
    super(teamMemberService);
  }

  @Get('my-evaluation-list')
  async getMyEvaluationList(@Query('q') q: string, @CurrentUser() user: any) {
    const query = decodeCollectionQuery(q);
    return await this.teamMemberService.getMyEvaluationList(query, user);
  }

  @Get('evaluation-vendors-list/:rfxId/:isTeamAssessment?')
  @ApiOperation({
    summary: 'List of Vendors for a given RFQ for Evaluation',
    description:
      'Returns isTeamEvaluationCompleted (if isTeamAssessment) and isEvaluationCompleted with the response',
  })
  async getVendorsList(
    @Param('rfxId') rfxId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    const isTeam = isTeamAssessment ? true : false;
    return await this.teamMemberService.vendorsList(rfxId, isTeam, query);
  }
}
