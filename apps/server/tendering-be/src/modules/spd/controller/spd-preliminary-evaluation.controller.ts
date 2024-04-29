import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdPreliminaryEvaluation } from 'src/entities';
import {
  CreateSpdPreliminaryEvaluationDto,
  UpdateSpdPreliminaryEvaluationDto,
} from '../dto';
import { SpdPreliminaryEvaluationService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdPreliminaryEvaluationDto,
  updateDto: UpdateSpdPreliminaryEvaluationDto,
};

@ApiBearerAuth()
@Controller('spd-preliminary-evaluations')
@ApiTags('Spd Preliminary Evaluations')
export class SpdPreliminaryEvaluationController extends ExtraCrudController<SpdPreliminaryEvaluation>(
  options,
) {
  constructor(
    private readonly spdPreliminaryEvaluationService: SpdPreliminaryEvaluationService,
  ) {
    super(spdPreliminaryEvaluationService);
  }
}
