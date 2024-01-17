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
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetActivityDocument } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { PreBudgetActivityDocumentService } from '../services/pre-budget-activity-documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/shared/authorization';

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
    @Res() res?: any,
    @CurrentUser() user?: any,
  ) {
    fileInfo.organizationId = user.organization.id;
    const presignedUrl =
      await this.preBudgetActivityDocumentService.generatePresignedPutUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }

  @Get('preview/:id')
  async preview(@Param('id') id: string, @Res() res) {
    const fileInfo = await this.preBudgetActivityDocumentService.findOne(id);
    const result =
      await this.preBudgetActivityDocumentService.download(fileInfo);
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
    const fileInfo = await this.preBudgetActivityDocumentService.findOne(id);
    const presignedUrl =
      await this.preBudgetActivityDocumentService.generatePresignedGetUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }
}
