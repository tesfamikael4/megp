import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementRequisitionDocument } from 'src/entities';
import {
  CreateProcurementRequisitionDocumentDto,
  UpdateProcurementRequisitionDocumentDto,
} from '../dto/procurement-requisition-document.dto';
import { ProcurementRequisitionDocumentService } from '../services/procurement-requisition-document.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionDocumentDto,
  updateDto: UpdateProcurementRequisitionDocumentDto,
};

@Controller('procurement-requisition-documents')
@ApiTags('procurement-requisition-documents')
export class ProcurementRequisitionDocumentController extends ExtraCrudController<ProcurementRequisitionDocument>(
  options,
) {
  constructor(
    private readonly ProcurementRequisitionDocumentService: ProcurementRequisitionDocumentService,
  ) {
    super(ProcurementRequisitionDocumentService);
  }
}
