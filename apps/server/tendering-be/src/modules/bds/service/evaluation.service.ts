import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsEvaluation } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsEvaluationService extends ExtraCrudService<BdsEvaluation> {
  constructor(
    @InjectRepository(BdsEvaluation)
    private readonly bdsEvaluationRepository: Repository<BdsEvaluation>,
  ) {
    super(bdsEvaluationRepository);
  }
}
