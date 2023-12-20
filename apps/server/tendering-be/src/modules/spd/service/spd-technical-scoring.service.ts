import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdTechnicalScoringEntity } from 'src/entities';

@Injectable()
export class SpdTechnicalScoringService extends EntityCrudService<SpdTechnicalScoringEntity> {
  constructor(
    @InjectRepository(SpdTechnicalScoringEntity)
    private readonly spdTechnicalScoringRepository: Repository<SpdTechnicalScoringEntity>,
  ) {
    super(spdTechnicalScoringRepository);
  }
}
