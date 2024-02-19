import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { Document } from 'src/entities';
import { CreateDocumentDto, UpdateDocumentDto } from '../dto/document.dto';
import { DocumentService } from '../services/document.service';
import { FileResponseDto } from 'src/shared/domain';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateDocumentDto,
  updateDto: UpdateDocumentDto,
};

@Controller('documents')
@ApiTags('documents')
export class DocumentController extends ExtraCrudController<Document>(options) {
  constructor(
    private readonly procurementRequisitionDocumentService: DocumentService,
  ) {
    super(procurementRequisitionDocumentService);
  }

  @Get('preview/:id')
  async preview(@Param('id') id: string, @Res() res) {
    const fileInfo: any =
      await this.procurementRequisitionDocumentService.findOne(id);
    const result =
      await this.procurementRequisitionDocumentService.download(fileInfo);
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
    const fileInfo: FileResponseDto =
      await this.procurementRequisitionDocumentService.findOne(id);
    const presignedUrl =
      await this.procurementRequisitionDocumentService.generatePresignedGetUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }
}
