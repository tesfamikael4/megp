import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Get('team-members-eval/:rfxDocumentaryEvidenceId')
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
  async getEvaluation(
    @Param('rfxId') rfxId: string,
    @Param('rfxDocumentaryEvidenceId') rfxDocumentaryEvidenceId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.getEvaluation(
      rfxId,
      rfxDocumentaryEvidenceId,
      isTeamAssessment,
      user,
    );
  }

  @Get('can-submit-vendor-eval/:solRegistrationId')
  async canSubmitEvaluation(
    @Param('solRegistrationId') solRegistrationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.canSubmitVendorEvaluation(
      solRegistrationId,
      user,
    );
  }

  @Get('submit-vendor-eval/:solRegistrationId/:isTeamAssessment')
  async submitVendorEvaluation(
    @Param('solRegistrationId') solRegistrationId: string,
    @Param('isTeamAssessment') isTeamAssessment: boolean,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.submitVendorEvalitaion(
      solRegistrationId,
      isTeamAssessment,
      user,
    );
  }

  @Get('can-submit-rfx-eval/:rfxId')
  async canSubmitRfxEvaluation(
    @Param('solRegistrationId') solRegistrationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.canSubmitVendorEvaluation(
      solRegistrationId,
      user,
    );
  }

  // @Patch('submit/:rfxId')
  // async submitEvaluation(@Param('rfxId') rfxId: string) {
  //   return await this.evalReponseService.submitEvaluation(rfxId);
  // }
}
