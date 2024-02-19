import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementRequisition, ProcurementMechanism } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementMechanismService extends ExtraCrudService<ProcurementMechanism> {
  constructor(
    @InjectRepository(ProcurementMechanism)
    private readonly repositoryProcurementMechanism: Repository<ProcurementMechanism>,

    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryProcurementMechanism);
  }
}
