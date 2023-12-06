import { Injectable } from '@nestjs/common';
import { ProcurementThreshold } from '@entities';
import { EntityCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementThresholdService extends EntityCrudService<ProcurementThreshold> {
  constructor(
    @InjectRepository(ProcurementThreshold)
    private readonly procurementThresholdRepository: Repository<ProcurementThreshold>,
  ) {
    super(procurementThresholdRepository);
  }
}
