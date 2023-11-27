import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProcurementRequisition } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class ProcurementRequisitionService extends ExtraCrudService<ProcurementRequisition> {
  constructor(
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryProcurementRequisition);
  }
}
