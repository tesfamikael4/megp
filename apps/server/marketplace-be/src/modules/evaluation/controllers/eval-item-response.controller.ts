import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { EvalItemResponse } from 'src/entities';
import { EvalItemResponseService } from '../services/eval-item-response.service';
import { CreateEvalItemResponseDto } from '../dtos/eval-item-response.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateEvalItemResponseDto,
};

@ApiBearerAuth()
@Controller('eval-item-responses')
@ApiTags('Evaluation Item Responses Controller')
export class EvalItemResponseController extends ExtraCrudController<EvalItemResponse>(
  options,
) {
  constructor(
    private readonly evalItemResponseService: EvalItemResponseService,
  ) {
    super(evalItemResponseService);
  }

  @Get('team-members-eval/:rfxProductInvitationId')
  async getTeamMembersEvaluation(
    @Param('rfxProductInvitationId') rfxProductInvitationId: string,
    @Param('solRegistrationId') solRegistrationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.evalItemResponseService.getTeamMembersEvaluation(
      rfxProductInvitationId,
      solRegistrationId,
      user,
    );
  }
}
