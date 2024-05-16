import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';

import { TechnicalQualificationAssessment } from 'src/entities/technical-qualification-assessments.entity';
import { TechnicalQualificationAssessmentService } from '../service/technical-qualification-assessment.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  // createDto: CreateTechnicalQualificationAssessmentsDto,
};

@Controller('technical-qualification-assessments')
export class TechnicalQualificationAssessmentsController extends ExtraCrudController<TechnicalQualificationAssessment>(
  options,
) {
  constructor(
    private readonly technicalQualificationAssessmentService: TechnicalQualificationAssessmentService,
  ) {
    super(technicalQualificationAssessmentService);
  }
}
