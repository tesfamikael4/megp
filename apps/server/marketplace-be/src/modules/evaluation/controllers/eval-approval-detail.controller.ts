import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { EvalApprovalDetail } from 'src/entities';
import {
  CreateEvalApproverDto,
  UpdateEvalApproverDto,
} from '../dtos/eval-approver.dto';
import { EvalApprovalDetailService } from '../services/eval-approval-detail.service';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateEvalApproverDto,
  updateDto: UpdateEvalApproverDto,
};

@ApiBearerAuth()
@Controller('eval-approval-details')
@ApiTags('Evaluation Approver Controller')
export class EvalApprovalDetailController extends ExtraCrudController<EvalApprovalDetail>(
  options,
) {
  constructor(
    private readonly evalApproverDetailService: EvalApprovalDetailService,
  ) {
    super(evalApproverDetailService);
  }
}
