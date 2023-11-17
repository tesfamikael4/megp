import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementRequisitionAttachment } from 'src/entities';
import {
  CreateProcurementRequisitionAttachmentDto,
  UpdateProcurementRequisitionAttachmentDto,
} from '../dto/procurement-requisition-attachment.dto';
import { ProcurementRequisitionAttachmentService } from '../services/procurement-requisition-attachment.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionAttachmentDto,
  updateDto: UpdateProcurementRequisitionAttachmentDto,
};

@Controller('procurement-requisition-attachments')
@ApiTags('procurement-requisition-attachments')
export class ProcurementRequisitionAttachmentController extends ExtraCrudController<ProcurementRequisitionAttachment>(
  options,
) {
  constructor(
    private readonly procurementRequisitionAttachmentService: ProcurementRequisitionAttachmentService,
  ) {
    super(procurementRequisitionAttachmentService);
  }
}
