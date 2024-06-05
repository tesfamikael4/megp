import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { EvalResponse } from 'src/entities';
import { EvalResponseService } from '../services/eval-response.service';
import { CreateEvalResponseDto } from '../dtos/eval-response.dto';
import { DeepPartial } from 'typeorm';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateEvalResponseDto,
};

@ApiBearerAuth()
@Controller('eval-responses')
@ApiTags('Evaluation Responses Controller')
export class EvalResponseController extends ExtraCrudController<EvalResponse>(
  options,
) {
  constructor(private readonly evalReponseService: EvalResponseService) {
    super(evalReponseService);
  }

  @Get('can-start-team-assessment/:rfxId')
  @ApiOperation({
    summary:
      'Can start team assessment if all the team members including the team lead have evaluated the RFX',
  })
  async canStartTeamAssessment(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.canStartTeamAssessment(rfxId, user);
  }

  @Get('team-members-eval/:rfxDocumentaryEvidenceId/:solRegistrationId')
  @ApiOperation({
    summary:
      'Get all evaluations for the evaluated document for the team leader to make the team assessment',
  })
  async getTeamMembersEvaluation(
    @Param('rfxDocumentaryEvidenceId') rfxDocumentaryEvidenceId: string,
    @Param('solRegistrationId') solRegistrationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.getTeamMembersEvaluations(
      rfxDocumentaryEvidenceId,
      solRegistrationId,
      user,
    );
  }

  @Get('my-response/:rfxId/:rfxDocumentaryEvidenceId/:isTeamAssessment')
  @ApiOperation({
    summary: 'Gets my evaluation for vendor for a specific document',
  })
  async getEvaluation(
    @Param('solRegistrationId') solRegistrationId: string,
    @Param('rfxDocumentaryEvidenceId') rfxDocumentaryEvidenceId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.getEvaluation(
      solRegistrationId,
      rfxDocumentaryEvidenceId,
      isTeamAssessment,
      user,
    );
  }

  @Patch('submit-rfx-eval/:rfxId/:isTeamAssessment')
  @ApiOperation({
    summary:
      'Submit venRFXdor evaluation after completeing all Vendors evaluations',
  })
  async submitRfxEvaluation(
    @Param('rfxId') rfxId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.submitRfxEvaluation(
      rfxId,
      isTeamAssessment,
      user,
    );
  }

  @Get('can-submit-vendor-eval/:solRegistrationId/:isTeamAssessment')
  @ApiOperation({
    summary:
      'Check if the team member can submit vendor evaluation after completeing all documentary evaluations',
    description: 'enables a button on the frontend',
  })
  async canSubmitEvaluation(
    @Param('solRegistrationId') solRegistrationId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.canSubmitVendorEvaluation(
      solRegistrationId,
      isTeamAssessment,
      user,
    );
  }

  @Patch('submit-vendor-eval/:solRegistrationId/:isTeamAssessment')
  @ApiOperation({
    summary:
      'Submit vendor evaluation after completeing all documentary evaluations',
  })
  async submitVendorEvaluation(
    @Param('solRegistrationId') solRegistrationId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.submitVendorEvaluataion(
      solRegistrationId,
      isTeamAssessment,
      user,
    );
  }

  @Get('can-submit-rfx-eval/:rfxId/:isTeamAssessment')
  @ApiOperation({
    summary:
      'Check if the team member can submit the RFX evaluation after completeing all vendors evaluations',
    description: 'enables a button on the frontend',
  })
  async canSubmitRfxEvaluation(
    @Param('rfxId') rfxId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.canSubmitRfxEvaluation(
      rfxId,
      isTeamAssessment,
      user,
    );
  }

  @Get('my-responses/:rfxId/:solRegistrationId/:isTeamAssessment')
  @ApiOperation({
    summary:
      'List of documentary evidences together with their evaluation assessment result indicator of a vendor',
  })
  async getMyResponses(
    @Param('rfxId') rfxId: string,
    @Param('solRegistrationId') solRegistrationId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.myResponses(
      rfxId,
      solRegistrationId,
      isTeamAssessment,
      user,
    );
  }

  // @Patch('submit/:rfxId')
  // async submitEvaluation(@Param('rfxId') rfxId: string) {
  //   return await this.evalReponseService.submitEvaluation(rfxId);
  // }
}
