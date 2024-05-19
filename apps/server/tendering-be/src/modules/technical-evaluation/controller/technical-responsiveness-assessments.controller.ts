import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';

import { TechnicalResponsivenessAssessment } from 'src/entities/technical-responsiveness-assessments.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiTags } from '@nestjs/swagger';
import { TechnicalResponsivenessAssessmentService } from '../service/technical-responsiveness-assessment.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  // createDto: CreateTechnicalResponsivenessAssessmentsDto,
};

@Controller('technical-responsiveness-assessments')
@ApiTags('Technical Responsiveness Assessment  Controller')
export class TechnicalResponsivenessAssessmentController extends ExtraCrudController<TechnicalResponsivenessAssessment>(
  options,
) {
  constructor(
    private readonly technicalResponsivenessAssessmentService: TechnicalResponsivenessAssessmentService,
  ) {
    super(technicalResponsivenessAssessmentService);
  }
}
