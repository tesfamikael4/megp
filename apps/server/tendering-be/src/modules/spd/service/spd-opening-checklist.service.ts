import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdOpeningChecklist } from 'src/entities';

@Injectable()
export class SpdOpeningChecklistService extends EntityCrudService<SpdOpeningChecklist> {
  constructor(
    @InjectRepository(SpdOpeningChecklist)
    private readonly spdOpeningChecklistRepository: Repository<SpdOpeningChecklist>,
  ) {
    super(spdOpeningChecklistRepository);
  }
}
