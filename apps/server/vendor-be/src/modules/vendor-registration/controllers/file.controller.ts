import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, CurrentUser, JwtGuard } from 'src/shared/authorization';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { Response } from 'express';
import { ReceiptDto } from '../dto/receipt.dto';
import { UploadFileDto } from '../dto/file.dto';

@Controller('upload')
@ApiTags('File')
@ApiResponse({ status: 500, description: 'Internal error' })
export class UploadController {
  constructor(
    // private tusService: TusService,
    private fileService: FileService,
  ) { }
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
    console.log('fto of file ', dto);
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
      transactionNumber: transactionId,
      invoiceIds: invoiceIds,
      userInfo: userInfo,
      attachment: attachment == 'null' ? null : attachment,
    };
    const result = await this.fileService.uploadPaymentReceiptAttachment(
      file,
      uploadFileDto,
      userInfo
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
  @AllowAnonymous()
  @Get('get-vendor-certificate/:fileId/:userId')
  async getVendorCertificate(
    @Param('fileId') fileId: string,
    @Param('userId') userId: string,
    @Res() res,
  ) {
    return await this.fileService.getCertificate(fileId, userId, res);
  }

  @Get('get-file/:fileUploadName/:fileId')
  async getfile(
    @Param('fileUploadName') fileUploadName: string,
    @Param('fileId') fileId: string,
    @CurrentUser() userInfo: any,
    userId: string,
    @Res() res: Response,
  ) {
    try {
      return this.fileService.getFile(userInfo.id, fileId, fileUploadName, res);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-file-bo/:documentType/:fileName/:userId')
  async getfileBo(
    @Param('documentType') documentType: string,
    @Param('fileName') fileName: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    console.log('fileName, documentType', fileName, documentType);
    try {
      const result = await this.fileService.getFile(
        userId,
        fileName,
        documentType,
        res,
      );
      return result;
      //   return result;
      // res.setHeader('Content-Type', 'application/octet-stream');
      // res.send(result);
    } catch (error) {
      throw error;
    }
  }
}
