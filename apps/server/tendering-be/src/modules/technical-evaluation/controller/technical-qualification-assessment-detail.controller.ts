import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TechnicalQualificationAssessmentDetailService } from '../service/technical-qualification-assessment-detail.service';
import { TechnicalQualificationAssessmentDetail } from 'src/entities/technical-qualification-assessment-detail.entity';

const options: ExtraCrudOptions = {
  entityIdName: 'technicalQualificationAssessmentId',
  // createDto: CreateTechnicalQualificationAssessmentDetailDto,
};

@Controller('technical-qualification-evaluation')
export class TechnicalQualificationAssessmentDetailController extends ExtraCrudController<TechnicalQualificationAssessmentDetail>(
  options,
) {
  constructor(
    private readonly technicalQualificationAssessmentDetailService: TechnicalQualificationAssessmentDetailService,
  ) {
    super(technicalQualificationAssessmentDetailService);
  }
}
