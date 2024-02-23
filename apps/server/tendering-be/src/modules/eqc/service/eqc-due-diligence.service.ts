import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EqcDueDiligence } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class EqcDueDiligenceService extends ExtraCrudService<EqcDueDiligence> {
  constructor(
    @InjectRepository(EqcDueDiligence)
    private readonly EqcDueDiligenceRepository: Repository<EqcDueDiligence>,
  ) {
    super(EqcDueDiligenceRepository);
  }
}
