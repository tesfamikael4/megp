import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';

@Injectable()
export class TechnicalPreliminaryAssessmentService extends ExtraCrudService<TechnicalPreliminaryAssessment> {
  constructor(
    @InjectRepository(TechnicalPreliminaryAssessment)
    private readonly technicalPreliminaryAssessmentRepository: Repository<TechnicalPreliminaryAssessment>,
  ) {
    super(technicalPreliminaryAssessmentRepository);
  }
}
