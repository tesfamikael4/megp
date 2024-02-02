import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdTechnicalScoring } from 'src/entities';

@Injectable()
export class SpdTechnicalScoringService extends EntityCrudService<SpdTechnicalScoring> {
  constructor(
    @InjectRepository(SpdTechnicalScoring)
    private readonly spdTechnicalScoringRepository: Repository<SpdTechnicalScoring>,
  ) {
    super(spdTechnicalScoringRepository);
  }
}
