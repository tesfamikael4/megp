import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BdsSubmission } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BdsSubmissionService } from '../service/submission.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('bds-submissions')
@ApiTags('Bds Submission Controller')
export class BdsSubmissionController extends ExtraCrudController<BdsSubmission>(
  options,
) {
  constructor(private readonly BdsSubmissionService: BdsSubmissionService) {
    super(BdsSubmissionService);
  }
}
