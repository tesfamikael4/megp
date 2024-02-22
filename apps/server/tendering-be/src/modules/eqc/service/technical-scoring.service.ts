import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EqcTechnicalScoring } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class EqcTechnicalScoringService extends ExtraCrudService<EqcTechnicalScoring> {
  constructor(
    @InjectRepository(EqcTechnicalScoring)
    private readonly EqcTechnicalScoringRepository: Repository<EqcTechnicalScoring>,
  ) {
    super(EqcTechnicalScoringRepository);
  }
}
