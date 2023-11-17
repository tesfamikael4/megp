import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProcurementRequisitionAttachment } from 'src/entities';

@Injectable()
export class ProcurementRequisitionAttachmentService extends ExtraCrudService<ProcurementRequisitionAttachment> {
  constructor(
    @InjectRepository(ProcurementRequisitionAttachment)
    private readonly repositoryProcurementRequisitionAttachment: Repository<ProcurementRequisitionAttachment>,
  ) {
    super(repositoryProcurementRequisitionAttachment);
  }
}
