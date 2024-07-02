import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { EvalApproval } from 'src/entities';
import {
  CreateEvalApproverDto,
  UpdateEvalApproverDto,
} from '../dtos/eval-approver.dto';
import { EvalApprovalService } from '../services/eval-approval.service';

const options: ExtraCrudOptions = {
  entityIdName: 'evalApproverId',
  createDto: CreateEvalApproverDto,
  updateDto: UpdateEvalApproverDto,
};

@ApiBearerAuth()
@Controller('eval-approvals')
@ApiTags('Evaluation Approval Controller')
export class EvalApprovalController extends ExtraCrudController<EvalApproval>(
  options,
) {
  constructor(private readonly evalApprovalService: EvalApprovalService) {
    super(evalApprovalService);
  }

  @Get('can-approve/:rfxId')
  async canApprove(@Param('rfxId') rfxId: string, @CurrentUser() user: any) {
    return await this.evalApprovalService.canApprove(rfxId, user);
  }

  @Get('can-make-approval/:rfxId')
  async canMakeApproval(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
  ) {
    return await this.evalApprovalService.canMakeApproval(rfxId, user);
  }

  @Patch('complete-approval/:rfxId')
  async approve(@Param('rfxId') rfxId: string, @CurrentUser() user: any) {
    return await this.evalApprovalService.completeRfxApproval(rfxId, user);
  }
}
