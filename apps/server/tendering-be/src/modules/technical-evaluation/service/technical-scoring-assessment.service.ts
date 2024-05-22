import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TechnicalScoringAssessment } from 'src/entities/technical-scoring-assessments.entity';

@Injectable()
export class TechnicalScoringAssessmentService extends ExtraCrudService<TechnicalScoringAssessment> {
  constructor(
    @InjectRepository(TechnicalScoringAssessment)
    private readonly technicalScoringAssessmentRepository: Repository<TechnicalScoringAssessment>,
  ) {
    super(technicalScoringAssessmentRepository);
  }
}
