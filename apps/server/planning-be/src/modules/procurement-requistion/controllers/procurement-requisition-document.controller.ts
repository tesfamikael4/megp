import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementRequisitionDocument } from 'src/entities';
import {
  CreateProcurementRequisitionDocumentDto,
  UpdateProcurementRequisitionDocumentDto,
} from '../dto/procurement-requisition-document.dto';
import { ProcurementRequisitionDocumentService } from '../services/procurement-requisition-document.service';
import { CurrentUser } from 'src/shared/authorization';

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
    private readonly procurementRequisitionDocumentService: ProcurementRequisitionDocumentService,
  ) {
    super(procurementRequisitionDocumentService);
  }
  @Post('upload')
  async upload(@CurrentUser() user: any, @Body() fileInfo: any) {
    return await this.procurementRequisitionDocumentService.upload(
      user,
      fileInfo,
    );
  }
  @Get('preview/:id')
  async preview(@Param('id') id: string) {
    return await this.procurementRequisitionDocumentService.download(id);
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    return await this.procurementRequisitionDocumentService.generatePresignedGetUrl(
      id,
    );
  }
}
