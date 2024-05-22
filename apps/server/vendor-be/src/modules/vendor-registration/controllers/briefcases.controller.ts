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
import { BriefCaseDto } from '../dto/briefcase.dto';

@Controller('briefcases')
@ApiTags('briefcases')
@ApiResponse({ status: 500, description: 'Internal error' })
export class BriefcasesController {
  constructor(private readonly briefcaseService: BriefcasesService) { }

  @Get('download/:fileId')
  async downloadMyBriefcase(
    @CurrentUser() userInfo: any,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const result = await this.briefcaseService.getFile(
      userInfo.id,
      fileId,
      res,
    );
    return result;
  }
  // @AllowAnonymous()
  @Post('upload')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadBriefcase(
    @UploadedFile() file: Express.Multer.File,
    @Body() briefcase: BriefCaseDto,
    @CurrentUser() user: any,
  ) {
    const result = await this.briefcaseService.uploadBriefcase(file, briefcase, user);
    return result;
  }

  @Get('get-briefcases')
  async myBriefcases(@CurrentUser() user: any) {
    const result = this.briefcaseService.getBriefcases(user);
    return result;
  }

  @Delete('/:id')
  async deleteBriefcase(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.briefcaseService.removeBriefcase(id, user);
  }
}
