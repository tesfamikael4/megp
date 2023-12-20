import {
  All,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TusService } from '../services/tus.service';
import { UserInfo, userInfo } from 'os';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AllowAnonymous,
  CurrentUser,
  JwtGuard,
} from 'src/shared/authorization';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { File } from '../services/file.service';

@Controller('upload')
@ApiTags('File')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class UploadController {
  constructor(
    // private tusService: TusService,
    private fileService: File,
  ) {}
  // @Get('get-file/:fileName')
  // async getFile(
  //   @Param('fileName') fileName: string,
  //   @Req() req,
  //   @Res() res,
  //   @CurrentUser() userInfo: any,
  // ) {
  //   fileName = userInfo.id + '/' + fileName;
  //   const result = await this.tusService.getFileFromMinio(
  //     req,
  //     res,
  //     userInfo.id,
  //     fileName,
  //   );
  //   return res.send(result);
  // }
  // @Get(':fileId')
  // async fetchFile(@Param('fileName') fileName: string, @Req() req, @Res() res) {
  //   const userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
  //   fileName = userId + '/' + fileName;
  //   return this.tusService.getFile(req, res, userId, fileName);
  // }

  // @Delete(':fileName')
  // async deleteFile(
  //   @Param('fileName') fileName: string,
  //   @Req() req,
  //   @Res() res,
  // ) {
  //   const userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
  //   return this.tusService.deleteFileFromMinio(req, res, userId, fileName);
  // }

  @Post('upload-payment-receipt/:transactionId/:serviceId/:invoiceId')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadPaymentRecept(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userInfo: any,
    @Param('transactionId') transactionId: string,
    @Param('serviceId') serviceId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    if (!file) {
      return { error: 'File not received' };
    }
    const paymentReceiptDto = {
      transactionId: transactionId,
      serviceId: serviceId,
      invoiceId: invoiceId,
    };
    const result = await this.fileService.uploadPaymentAttachment(
      file,
      userInfo.id,
      paymentReceiptDto,
    );
    return result;
  }
  @Get('get-attachment-pre-signed-object/:fileName')
  async getAttachmentpresignedObject(
    @Param('fileName') fileName: string,
    @CurrentUser() userInfo: any,
  ) {
    const fieldName = 'paymentReceipt';
    const fileId = `${userInfo.id}/${fieldName}/${fileName}`;
    return this.fileService.getAttachmentpresignedObject(fileId);
  }
  @Post('upload-supporting-document-attachment/:fieldName/:serviceId/')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadSupportingDocumentAttachment(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userInfo: any,
    @Param('fieldName') fieldName: string,
    @Param('serviceId') serviceId: string,
  ) {
    if (!file) {
      return { error: 'File not received' };
    }
    const paymentReceiptDto = {
      fieldName: fieldName,
      serviceId: serviceId,
    };
    const result = await this.fileService.uploadSupportingDocumentAttachment(
      file,
      userInfo.id,
      paymentReceiptDto,
    );
    return result;
  }
  @Get('get-supporting-document-attachment-pre-signed-object/:fileName')
  async getSupportingDocumentAttachmentpresignedObject(
    @Param('fileName') fileName: string,
    @CurrentUser() userInfo: any,
  ) {
    return await this.fileService.getSupportingDocumentAttachmentpresignedObject(
      fileName,
      userInfo.id,
    );
  }
  // @All('*')
  // async tus(@Req() req, @Res() res, @CurrentUser() userInfo: any) {
  //   return this.tusService.handleTus(req, res, userInfo);
  // }
}
