import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { EqcDocumentaryEvidence } from 'src/entities';

@Injectable()
export class EqcDocumentaryEvidenceService extends ExtraCrudService<EqcDocumentaryEvidence> {
  constructor(
    @InjectRepository(EqcDocumentaryEvidence)
    private readonly eqcDocumentaryEvidenceRepository: Repository<EqcDocumentaryEvidence>,
  ) {
    super(eqcDocumentaryEvidenceRepository);
  }
}
