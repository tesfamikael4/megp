import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdRequiredDocumentaryEvidence } from 'src/entities/spd-required-documentary-evidence.entity';

@Injectable()
export class SpdRequiredDocumentaryEvidenceService extends EntityCrudService<SpdRequiredDocumentaryEvidence> {
  constructor(
    @InjectRepository(SpdRequiredDocumentaryEvidence)
    private readonly spdRequiredDocumentaryEvidencesRepository: Repository<SpdRequiredDocumentaryEvidence>,
  ) {
    super(spdRequiredDocumentaryEvidencesRepository);
  }
}
