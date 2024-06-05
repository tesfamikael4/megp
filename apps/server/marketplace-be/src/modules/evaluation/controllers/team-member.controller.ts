import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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

  @Get('is-team-lead/:rfxId')
  async isTeamLead(@Param('rfxId') rfxId: string, @CurrentUser() user: any) {
    return await this.teamMemberService.isTeamLead(rfxId, user);
  }

  @Get('my-evaluation-list')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyEvaluationList(@CurrentUser() user: any, @Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.teamMemberService.getMyEvaluationList(query, user);
  }

  @Get('evaluation-vendors-list/:rfxId/:isTeamAssessment?')
  @ApiOperation({
    summary: 'List of Vendors for a given RFQ for Evaluation',
    description:
      'Returns isTeamEvaluationCompleted (if isTeamAssessment) and isEvaluationCompleted with the response',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getVendorsList(
    @Param('rfxId') rfxId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    const isTeam = isTeamAssessment ? true : false;
    return await this.teamMemberService.vendorsList(rfxId, isTeam, user, query);
  }
}
