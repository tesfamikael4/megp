import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';

import { TechnicalScoringAssessment } from 'src/entities/technical-scoring-assessments.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiTags } from '@nestjs/swagger';
import { TechnicalScoringAssessmentService } from '../service/technical-scoring-assessment.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  // createDto: CreateTechnicalScoringAssessmentsDto,
};

@Controller('technical-scoring-assessments')
@ApiTags('Technical Scoring Assessment  Controller')
export class TechnicalScoringAssessmentController extends ExtraCrudController<TechnicalScoringAssessment>(
  options,
) {
  constructor(
    private readonly technicalScoringAssessmentService: TechnicalScoringAssessmentService,
  ) {
    super(technicalScoringAssessmentService);
  }
}
