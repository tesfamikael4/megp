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
import { TenderSpdContractForm } from 'src/entities/tender-spd-contract-form.entity';
import { TenderSpdContractFormService } from '../service/tender-spd-contract-form.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('tender-spd-Contract-forms')
@ApiTags('Tender Spd Contract Form Controller')
@AllowAnonymous()
export class TenderSpdContractFormController extends ExtraCrudController<TenderSpdContractForm>(
  options,
) {
  constructor(private readonly spdService: TenderSpdContractFormService) {
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
