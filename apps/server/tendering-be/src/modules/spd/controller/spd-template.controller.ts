import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { AllowAnonymous } from 'src/shared/authorization';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SpdTemplate } from 'src/entities/spd-template.entity';
import { SpdTemplateService } from '../service/spd-template.service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
};

@ApiBearerAuth()
@Controller('spd-templates')
@ApiTags('Spd Template Controller')
@AllowAnonymous()
export class SpdTemplateController extends ExtraCrudController<SpdTemplate>(
  options,
) {
  constructor(private readonly spdService: SpdTemplateService) {
    super(spdService);
  }

  @Post('/upload-spd/:spdId/:type')
  @AllowAnonymous()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSPDDocument(
    @Param('spdId') spdId: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.spdService.uploadSPDDocument(spdId, type, file);
  }

  @Get('/download-spd-docx/:spdId/:type')
  @AllowAnonymous()
  async downloadSPDDocumentDocx(
    @Param('spdId') spdId: string,
    @Param('type') type: string,
  ) {
    return await this.spdService.downloadSPDDocumentDocx(spdId, type);
  }

  @Get('/download-spd-pdf/:spdId/:type')
  @AllowAnonymous()
  async downloadSPDDocumentPdf(
    @Param('spdId') spdId: string,
    @Param('type') type: string,
  ) {
    return await this.spdService.downloadSPDDocumentPdf(spdId, type);
  }
}
