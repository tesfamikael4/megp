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
import { SpdContractForm } from 'src/entities/spd-contract-form.entity';
import { SpdContractFormService } from '../service/spd-contract-form.service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
};

@ApiBearerAuth()
@Controller('spd-Contract-forms')
@ApiTags('Spd Contract Form Controller')
@AllowAnonymous()
export class SpdContractFormController extends ExtraCrudController<SpdContractForm>(
  options,
) {
  constructor(private readonly spdService: SpdContractFormService) {
    super(spdService);
  }

  @Post('/upload')
  @AllowAnonymous()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSPDDocument(
    @Body() payload: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.spdService.uploadSPDDocument(payload, file);
  }

  @Get('/download/:id')
  @AllowAnonymous()
  async downloadSPDDocumentPdf(@Param('id') id: string) {
    return this.spdService.downloadSPDDocumentPdf(id);
  }

  @Get('/download-docx/:id')
  @AllowAnonymous()
  async downloadSPDDocumentDocx(@Param('id') id: string) {
    return this.spdService.downloadSPDDocumentDocx(id);
  }
}
