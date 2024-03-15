import { ProcurementInstitution } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class ProcurementInstitutionService extends EntityCrudService<ProcurementInstitution> {
  constructor(
    @InjectRepository(ProcurementInstitution)
    private readonly procurementInstitutionRepository: Repository<ProcurementInstitution>,
  ) {
    super(procurementInstitutionRepository);
  }
}
