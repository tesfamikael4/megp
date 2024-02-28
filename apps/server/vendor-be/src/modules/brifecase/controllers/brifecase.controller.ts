import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrifecasesService } from '../services/brifecase.service';
import { CurrentUser } from 'src/shared/authorization';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('Brifecases')
export class BrifecaseController {
  constructor(private readonly brifrcaseService: BrifecasesService) {}

  @Get('fileId')
  async getFile(
    @CurrentUser() userInfo: any,
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const result = await this.brifrcaseService.getFile(
      userInfo.id,
      fileId,
      res,
    );
    return result;
  }
  @Get('fileId')
  async downloadMyBrifecase(
    @CurrentUser() userInfo: any,
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const result = await this.brifrcaseService.downloadMyBrifecase(
      userInfo.id,
      fileId,
    );
    return result;
  }
  @Post()
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadBrifecase(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userInfo: any,
  ) {
    const result = await this.brifrcaseService.uploadBrifecase(
      file,
      userInfo.id,
    );
    return result;
  }
}
