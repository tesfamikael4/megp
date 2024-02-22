import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BdsEvaluation } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BdsEvaluationService } from '../service/evaluation.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('bds-evaluations')
@ApiTags('Bds Evaluation Controller')
export class BdsEvaluationController extends ExtraCrudController<BdsEvaluation>(
  options,
) {
  constructor(private readonly BdsEvaluationService: BdsEvaluationService) {
    super(BdsEvaluationService);
  }
}
