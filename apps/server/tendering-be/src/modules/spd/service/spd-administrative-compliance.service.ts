import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdAdministrativeCompliance } from 'src/entities';

@Injectable()
export class SpdAdministrativeComplianceService extends EntityCrudService<SpdAdministrativeCompliance> {
  constructor(
    @InjectRepository(SpdAdministrativeCompliance)
    private readonly spdAdministrativeComplianceRepository: Repository<SpdAdministrativeCompliance>,
  ) {
    super(spdAdministrativeComplianceRepository);
  }
}
