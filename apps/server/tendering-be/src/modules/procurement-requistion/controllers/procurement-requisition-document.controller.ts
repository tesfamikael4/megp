import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementRequisitionDocument } from 'src/entities';
import {
  CreateProcurementRequisitionDocumentDto,
  ProcurementRequisitionDocumentResponseDto,
  UpdateProcurementRequisitionDocumentDto,
} from '../dto/procurement-requisition-document.dto';
import { ProcurementRequisitionDocumentService } from '../services/procurement-requisition-document.service';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('pre-signed-put-url')
  async preSignedPutUrl(@Body() fileInfo, @Res() res?: any) {
    const presignedUrl =
      await this.procurementRequisitionDocumentService.generatePresignedPutUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }

  @Get('preview/:id')
  async preview(@Param('id') id: string, @Res() res) {
    const fileInfo =
      await this.procurementRequisitionDocumentService.findOne(id);
    const result =
      await this.procurementRequisitionDocumentService.download(fileInfo);
    res.setHeader('Content-Type', fileInfo.fileType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileInfo.path}`,
    );
    result.pipe(res);

    return result;
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res) {
    const fileInfo =
      await this.procurementRequisitionDocumentService.findOne(id);
    const presignedUrl =
      await this.procurementRequisitionDocumentService.generatePresignedGetUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }
}
