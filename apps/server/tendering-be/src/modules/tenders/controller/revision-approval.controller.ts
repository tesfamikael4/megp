import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RevisionApproval } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { RevisionApprovalService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('revision-approvals')
@ApiTags('Revision Approval Controller')
export class RevisionApprovalController extends ExtraCrudController<RevisionApproval>(
  options,
) {
  constructor(
    private readonly revisionApprovalService: RevisionApprovalService,
  ) {
    super(revisionApprovalService);
  }
}
