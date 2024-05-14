import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreatePreliminaryAssessment } from '../dto/technical-preliminary-assessment.dto';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TechnicalPreliminaryAssessmentService } from '../service/technical-preliminary-assessment.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreatePreliminaryAssessment,
};

@Controller('technical-preliminary-assessment')
@ApiTags('Technical preliminary Assessment  Controller')
export class TechnicalPreliminaryAssessmentController extends ExtraCrudController<TechnicalPreliminaryAssessment>(
  options,
) {
  constructor(
    private readonly technicalPreliminaryAssessmentService: TechnicalPreliminaryAssessmentService,
  ) {
    super(technicalPreliminaryAssessmentService);
  }
}
