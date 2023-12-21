import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdRequiredDocumentaryEvidences } from 'src/entities/spd-required-documentary-evidences.entity';

@Injectable()
export class SpdRequiredDocumentaryEvidencesService extends EntityCrudService<SpdRequiredDocumentaryEvidences> {
  constructor(
    @InjectRepository(SpdRequiredDocumentaryEvidences)
    private readonly spdRequiredDocumentaryEvidencesRepository: Repository<SpdRequiredDocumentaryEvidences>,
  ) {
    super(spdRequiredDocumentaryEvidencesRepository);
  }
}
