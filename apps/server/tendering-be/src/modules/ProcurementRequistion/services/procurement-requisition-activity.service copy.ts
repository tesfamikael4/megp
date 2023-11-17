import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RelationCrudService } from 'src/shared/service';
import { ProcurementRequisitionActivity } from 'src/entities';

@Injectable()
export class ProcurementRequisitionActivityService extends RelationCrudService<ProcurementRequisitionActivity> {
  constructor(
    @InjectRepository(ProcurementRequisitionActivity)
    private readonly repositoryProcurementRequisitionActivity: Repository<ProcurementRequisitionActivity>,
  ) {
    super(repositoryProcurementRequisitionActivity);
  }
}
