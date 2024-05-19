import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TechnicalResponsivenessAssessment } from 'src/entities/technical-responsiveness-assessments.entity';

@Injectable()
export class TechnicalResponsivenessAssessmentService extends ExtraCrudService<TechnicalResponsivenessAssessment> {
  constructor(
    @InjectRepository(TechnicalResponsivenessAssessment)
    private readonly technicalResponsivenessAssessmentRepository: Repository<TechnicalResponsivenessAssessment>,
  ) {
    super(technicalResponsivenessAssessmentRepository);
  }
}
