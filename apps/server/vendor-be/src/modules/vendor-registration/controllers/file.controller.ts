import {
  All,
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TusService } from '../services/tus.service';
import { UserInfo, userInfo } from 'os';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';

@Controller('upload')
@ApiTags('File')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class UploadController {
  constructor(private tusService: TusService) {}
  @Get('get-file/:fileName')
  async getFile(
    @Param('fileName') fileName: string,
    @Req() req,
    @Res() res,
    @CurrentUser() userInfo: any,
  ) {
    fileName = userInfo.id + '/' + fileName;
    const result = await this.tusService.getFileFromMinio(
      req,
      res,
      userInfo.id,
      fileName,
    );
    return res.send(result);
  }
  @Get(':fileId')
  async fetchFile(@Param('fileName') fileName: string, @Req() req, @Res() res) {
    const userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    fileName = userId + '/' + fileName;
    return this.tusService.getFile(req, res, userId, fileName);
  }

  @Delete(':fileName')
  async deleteFile(
    @Param('fileName') fileName: string,
    @Req() req,
    @Res() res,
  ) {
    const userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return this.tusService.deleteFileFromMinio(req, res, userId, fileName);
  }
  @All('*')
  async tus(@Req() req, @Res() res, @CurrentUser() userInfo: any) {
    return this.tusService.handleTus(req, res, userInfo);
  }
}
