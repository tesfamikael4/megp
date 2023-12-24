import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PreProcurementMechanism } from 'src/entities';

@Injectable()
export class PreProcurementMechanismService extends ExtraCrudService<PreProcurementMechanism> {
  constructor(
    @InjectRepository(PreProcurementMechanism)
    private readonly repositoryPreProcurementMechanism: Repository<PreProcurementMechanism>,
  ) {
    super(repositoryPreProcurementMechanism);
  }
}
