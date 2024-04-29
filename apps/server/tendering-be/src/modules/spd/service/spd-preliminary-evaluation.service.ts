import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { SpdPreliminaryEvaluation } from 'src/entities';

@Injectable()
export class SpdPreliminaryEvaluationService extends ExtraCrudService<SpdPreliminaryEvaluation> {
  constructor(
    @InjectRepository(SpdPreliminaryEvaluation)
    private readonly spdPreliminaryEvaluationRepository: Repository<SpdPreliminaryEvaluation>,
  ) {
    super(spdPreliminaryEvaluationRepository);
  }
}
