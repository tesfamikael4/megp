import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser } from 'src/shared/authorization';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { BriefcasesService } from '../services/briefcases.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('briefcases')
@ApiTags('briefcases')
@ApiResponse({ status: 500, description: 'Internal error' })
export class BriefcasesController {
  constructor(private readonly brifrcaseService: BriefcasesService) {}

  @Get('download/:fileId')
  async downloadMyBrifecase(
    @CurrentUser() userInfo: any,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const result = await this.brifrcaseService.getFile(
      userInfo.id,
      fileId,
      res,
    );
    return result;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadBrifecase(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    const result = await this.brifrcaseService.uploadBrifecase(file, user);
    return result;
  }

  @Get('get-briefcases')
  async mybriefcases(@CurrentUser() user: any) {
    const result = this.brifrcaseService.getBriefcases(user);
    return result;
  }

  @Delete('/:id')
  async deleteBriefcase(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.brifrcaseService.removeBriefcase(id, user);
  }
}
