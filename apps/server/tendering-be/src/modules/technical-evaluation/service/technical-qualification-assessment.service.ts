import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TechnicalQualificationAssessment } from 'src/entities/technical-qualification-assessments.entity';

@Injectable()
export class TechnicalQualificationAssessmentService extends ExtraCrudService<TechnicalQualificationAssessment> {
  constructor(
    @InjectRepository(TechnicalQualificationAssessment)
    private readonly technicalQualificationAssessmentRepository: Repository<TechnicalQualificationAssessment>,
  ) {
    super(technicalQualificationAssessmentRepository);
  }
}
