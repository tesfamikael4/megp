import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { SpdDocumentaryEvidence } from 'src/entities';

@Injectable()
export class SpdDocumentaryEvidenceService extends ExtraCrudService<SpdDocumentaryEvidence> {
  constructor(
    @InjectRepository(SpdDocumentaryEvidence)
    private readonly spdDocumentaryEvidenceRepository: Repository<SpdDocumentaryEvidence>,
  ) {
    super(spdDocumentaryEvidenceRepository);
  }
}
