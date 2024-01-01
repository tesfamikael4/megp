import {
  All,
  Body,
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

import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { FileService } from '../services/file.service';
import { Response } from 'express';
import { IsNotEmpty } from 'class-validator';
import { ReceiptDto } from '../dto/receipt.dto';
import { UploadFileDto } from '../dto/file.dto';

@Controller('upload')
@ApiTags('File')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class UploadController {
  constructor(
    // private tusService: TusService,
    private fileService: FileService,
  ) {}
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

  @Post('upload-payment-receipt-upgrade')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadPaymentReceptUpgrade(
    @UploadedFile() attachment: Express.Multer.File,
    @CurrentUser() userInfo: any,
    @Body() dto: ReceiptDto,
  ) {
    if (!attachment) {
      return { error: 'File not received' };
    }
    const result = await this.fileService.uploadPaymentAttachmentUpgrade(
      attachment,
      userInfo,
      dto,
    );
    return result;
  }

  @Post('upload-payment-receipt-new/:transactionId/:invoiceId/:attachment')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadPaymentReceptNew(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userInfo: any,
    @Param('transactionId') transactionId: string,
    @Param('invoiceId') invoiceId: string,
    @Param('attachment') attachment: string,
  ) {
    if (!file) {
      return { error: 'File not received' };
    }
    const invoiceIds = invoiceId.split(',');
    const uploadFileDto: UploadFileDto = {
      transactionId: transactionId,
      invoiceIds: invoiceIds,
      userInfo: userInfo,
      attachment: attachment == 'null' ? null : attachment,
    };
    const result = await this.fileService.uploadPaymentReceiptAttachment(
      file,
      uploadFileDto,
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
  @Post('upload-supporting-document-attachment/:fieldName')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadSupportingDocumentAttachment(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userInfo: any,
    @Param('fieldName') fieldName: string,
  ) {
    if (!file) {
      return { error: 'File not received' };
    }
    const paymentReceiptDto = {
      fieldName: fieldName,
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
  @Post('upload-certificate/:businessAreaId')
  @UseInterceptors(FileInterceptor('attachmentUrl'))
  async uploadCertificate(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userInfo: any,
    @Param('businessAreaId') businessAreaId: string,
  ) {
    if (!file) {
      return { error: 'File not received' };
    }
    const result = await this.fileService.uploadCertificate(
      file,
      userInfo.id,
      businessAreaId,
    );
    return result;
  }
  @Get('get-certificate/:fileId')
  async getCertificate(
    @Param('fileId') fileId: string,
    @CurrentUser() userInfo: any,
    @Res() res,
  ) {
    return await this.fileService.getCertificate(fileId, userInfo.id, res);
  }

  @Get('get-file/:fileUploadName/:fileId')
  async getfile(
    @Param('fileUploadName') fileUploadName: string,
    @Param('fileId') fileId: string,
    @CurrentUser() userInfo: any,
    @Res() res: Response,
  ) {
    try {
      return this.fileService.getFile(userInfo.id, fileId, fileUploadName, res);
    } catch (error) {
      throw error;
    }
  }
  // @All('*')
  // async tus(@Req() req, @Res() res, @CurrentUser() userInfo: any) {
  //   return this.tusService.handleTus(req, res, userInfo);
  // }
}
