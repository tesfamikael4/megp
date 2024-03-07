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
import { TenderSpdBidForm } from 'src/entities/tender-spd-bid-form.entity';
import { TenderSpdBidFormService } from '../service/tender-spd-bid-form.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('tender-spd-bid-forms')
@ApiTags('Tender Spd Bid Form Controller')
@AllowAnonymous()
export class TenderSpdBidFormController extends ExtraCrudController<TenderSpdBidForm>(
  options,
) {
  constructor(private readonly spdService: TenderSpdBidFormService) {
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
