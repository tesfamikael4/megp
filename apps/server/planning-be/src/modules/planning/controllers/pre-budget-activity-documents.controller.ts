import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetActivityDocument } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { PreBudgetActivityDocumentService } from '../services/pre-budget-activity-documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AllowAnonymous, CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-budget-activity-documents')
@ApiTags('pre-budget-activity-documents')
export class PreBudgetActivityDocumentController extends ExtraCrudController<PreBudgetActivityDocument>(
  options,
) {
  constructor(
    private readonly preBudgetActivityDocumentService: PreBudgetActivityDocumentService,
  ) {
    super(preBudgetActivityDocumentService);
  }

  @Get('bucket-list')
  async initiateWorkflow() {
    await this.preBudgetActivityDocumentService.listAllBuckets();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.preBudgetActivityDocumentService.upload(file);
  }

  @Post('pre-signed-put-url')
  async preSignedPutUrl(
    @Body() fileInfo,
    @Req() req?: any,
    @CurrentUser() user?: any,
  ) {
    return await this.preBudgetActivityDocumentService.generatePresignedPutUrl(
      fileInfo,
      req,
    );
  }

  @Get('preview/:id')
  async preview(@Param('id') id: string, @Res() res) {
    const file = await this.preBudgetActivityDocumentService.findOne(id);
    const result = await this.preBudgetActivityDocumentService.download(file);
    res.setHeader('Content-Type', file.fileInfo.fileType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.fileInfo.path}`,
    );
    result.pipe(res);

    return result;
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    const presignedUrl =
      await this.preBudgetActivityDocumentService.generatePresignedGetUrl(id);
    return presignedUrl;
  }
}
