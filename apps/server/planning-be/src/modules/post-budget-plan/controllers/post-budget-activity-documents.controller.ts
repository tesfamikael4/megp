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
import { PostBudgetActivityDocument } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { PostBudgetActivityDocumentService } from '../services/post-budget-activity-documents.service';
import { FileInterceptor } from '@nestjs/platform-express';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('post-budget-activity-documents')
@ApiTags('post-budget-activity-documents')
export class PostBudgetActivityDocumentController extends ExtraCrudController<PostBudgetActivityDocument>(
  options,
) {
  constructor(
    private readonly postBudgetActivityDocumentService: PostBudgetActivityDocumentService,
  ) {
    super(postBudgetActivityDocumentService);
  }

  @Get('bucket-list')
  async initiateWorkflow() {
    await this.postBudgetActivityDocumentService.listAllBuckets();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.postBudgetActivityDocumentService.upload(file);
  }

  @Post('post-signed-put-url')
  async preSignedPutUrl(@Body() fileInfo, @Res() res?: any) {
    const presignedUrl =
      await this.postBudgetActivityDocumentService.generatePresignedPutUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }

  @Get('preview/:id')
  async preview(@Param('id') id: string, @Res() res) {
    const file = await this.postBudgetActivityDocumentService.findOne(id);
    const result = await this.postBudgetActivityDocumentService.download(file);
    res.setHeader('Content-Type', file.fileInfo.fileType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.fileInfo.path}`,
    );
    result.pipe(res);

    return result;
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res) {
    const fileInfo = await this.postBudgetActivityDocumentService.findOne(id);
    const presignedUrl =
      await this.postBudgetActivityDocumentService.generatePresignedGetUrl(
        fileInfo,
      );
    return res.status(HttpStatus.OK).json({ presignedUrl });
  }
}
