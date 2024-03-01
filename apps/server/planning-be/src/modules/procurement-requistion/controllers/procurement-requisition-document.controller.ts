import { Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
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
    private readonly procurementRequisitionProcurementRequisitionDocumentService: ProcurementRequisitionDocumentService,
  ) {
    super(procurementRequisitionProcurementRequisitionDocumentService);
  }
  @Post('upload')
  async upload(fileInfo: any) {
    return await this.procurementRequisitionProcurementRequisitionDocumentService.upload(
      fileInfo,
    );
  }
  @Get('preview/:id')
  async preview(@Param('id') id: string, @Res() res) {
    const fileInfo: any =
      await this.procurementRequisitionProcurementRequisitionDocumentService.findOne(
        id,
      );
    const result =
      await this.procurementRequisitionProcurementRequisitionDocumentService.download(
        fileInfo,
      );
    res.setHeader('Content-Type', fileInfo.fileType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileInfo.filepath}`,
    );
    result.pipe(res);

    return result;
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res) {
    const fileInfo: any =
      await this.procurementRequisitionProcurementRequisitionDocumentService.findOne(
        id,
      );
    const presignedUrl =
      await this.procurementRequisitionProcurementRequisitionDocumentService.generatePresignedGetUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }
}
