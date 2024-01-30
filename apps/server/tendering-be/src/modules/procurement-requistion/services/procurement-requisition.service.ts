import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProcurementRequisition } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
@Injectable()
export class ProcurementRequisitionService extends EntityCrudService<ProcurementRequisition> {
  constructor(
    @InjectRepository(ProcurementRequisition)
    private readonly repositoryProcurementRequisition: Repository<ProcurementRequisition>,
  ) {
    super(repositoryProcurementRequisition);
  }

  async create(itemData: any, req?: any): Promise<ProcurementRequisition> {
    return super.create(itemData, req);
  }
}
