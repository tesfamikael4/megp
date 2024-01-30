import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProcurementRequisitionDocument } from 'src/entities';

@Injectable()
export class ProcurementRequisitionDocumentService extends ExtraCrudService<ProcurementRequisitionDocument> {
  constructor(
    @InjectRepository(ProcurementRequisitionDocument)
    private readonly repositoryProcurementRequisitionDocument: Repository<ProcurementRequisitionDocument>,
  ) {
    super(repositoryProcurementRequisitionDocument);
  }
}
