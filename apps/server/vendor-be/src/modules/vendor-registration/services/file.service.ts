import * as Minio from 'minio';
import { HttpException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateFileDto, DeleteFileDto, UploadFileDto } from '../dto/file.dto';
import {
  BusinessAreaEntity,
  FilesEntity,
  InvoiceEntity,
  IsrVendorsEntity,
} from 'src/entities';

import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
import { Response } from 'express';
import { BusinessAreaService } from './business-area.service';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { ApplicationStatus } from 'src/modules/handling/enums/application-status.enum';
import { PaymentStatus } from 'src/shared/enums/payment-status.enum';

@Injectable()
export class FileService {
  private minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT_URL,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
  });
  private bucketName = process.env.BUCKETNAME;
  constructor(
    @InjectRepository(FilesEntity)
    private readonly fileRepository: Repository<FilesEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorsRepository: Repository<IsrVendorsEntity>,

    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
    private readonly busineAreaService: BusinessAreaService,
    private readonly workflowService: WorkflowService,
  ) { }
  private updateVendorEnums = [
    VendorStatusEnum.ACTIVE,
    VendorStatusEnum.ADJUSTMENT,
    VendorStatusEnum.COMPLETED,
    VendorStatusEnum.SUBMITTED,
    VendorStatusEnum.APPROVED,
    VendorStatusEnum.DRAFT
  ];
  async getFileNameByVendorId(vendorId: string) {
    try {
      return (
        await this.fileRepository.findOne({ where: { vendorId: vendorId } })
      ).fileName;
    } catch (error) {
      throw error;
    }
  }
  async getFileNameByVendorIdFileType(vendorId: string, bucketName: string) {
    try {
      return (
        await this.fileRepository.findOne({
          where: { vendorId: vendorId, fileType: bucketName },
        })
      ).fileName;
    } catch (error) {
      throw error;
    }
  }
  async getAttachment(
    fileName: string,
    bucketName: string,
    destination: string,
  ) {
    try {
      this.minioClient.fGetObject(
        bucketName,
        fileName,
        destination,
        function (err) {
          if (err) {
            return err;
          }
          return 'successfully downloaded';
        },
      );
    } catch (error) {
      throw error;
    }
  }
  async uploadAttachment(file: Express.Multer.File, command: CreateFileDto) {
    try {
      const result = this.uploadToRemoteServer(file, command);
      const fileDto = new CreateFileDto();

      fileDto.bucketName = result.bucketName;
      fileDto.fileName = result.fileName;
      fileDto.fileType = result.mimetype;
      fileDto.attachmentUrl = result.path;
      fileDto.path = result.path;
      fileDto.ownerId = result.ownerId;
      fileDto.originalName = result.originalname;
      return await this.fileRepository.save(fileDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async deleteAttachment(deleteFileDto: DeleteFileDto) {
    try {
      await this.minioClient.removeObject(
        deleteFileDto.bucketName,
        deleteFileDto.fileName,
      );
      const result = await this.fileRepository.delete(deleteFileDto.fileName);
      return result.affected > 0 ? true : false;
    } catch (error) {
      return error;
    }
  }
  uploadToRemoteServer(file: Express.Multer.File, command: CreateFileDto) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename =
      uniqueSuffix + '_' + command.fileName + '.' + file.mimetype.split('/')[1];
    const bucket = command.bucketName;
    const metaData = {
      'Content-Type': 'application/octet-stream',
      example: 5678,
    };
    this.minioClient.fPutObject(
      bucket,
      filename,
      file.path,
      metaData,
      function (err, etag) {
        if (err) return err;
      },
    );
    const response = new CreateFileDto();
    response.attachmentUrl = file.path;
    response.originalName = file.originalname;

    response.fileType = file.mimetype;

    response.path = command.path;
    return {
      ...file,
      ownerId: command.ownerId,
      bucketName: command.bucketName,
      fileName: filename,
    };
  }
  uploadToRemoteServerTus(file: Express.Multer.File, command: CreateFileDto) {
    const filename =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '_' +
      command.fileName +
      '.' +
      file.mimetype.split('/')[1];
    const bucket = command.bucketName;
    const serverUrl = 'http://your-tus-server-url.com/files';
    const metaData = {
      'Content-Type': 'application/octet-stream',
      example: 5678,
    };
    this.minioClient.fPutObject(
      bucket,
      filename,
      file.path,
      metaData,
      function (err, etag) {
        if (err) return err;
      },
    );
    const response = new CreateFileDto();
    response.attachmentUrl = file.path;
    response.originalName = file.originalname;

    response.fileType = file.mimetype;

    response.path = command.path;
    return {
      ...file,
      ownerId: command.ownerId,
      bucketName: command.bucketName,
      fileName: filename,
    };
  }

  async uploadPaymentAttachment(
    file: Express.Multer.File,
    userId: string,
    paymentReceiptDto: any,
  ) {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
      });
      if (!result) throw new HttpException('isr vendor not found ', 404);
      const fileUploadName = 'paymentReceipt';
      const paymentReceipts = result.paymentReceipt;

      const foundObject = paymentReceipts?.filter(
        (obj) => obj.invoiceId !== paymentReceiptDto.invoiceId,
      );
      const alreadyExisting = paymentReceipts?.find(
        (obj) => obj.invoiceId === paymentReceiptDto.invoiceId,
      );

      if (alreadyExisting) {
        const objectName = `${userId}/${fileUploadName}/${alreadyExisting.attachment}`;
        await this.minioClient.removeObject('megp', objectName);
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${file.originalname}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;

      const metaData = {
        'Content-Type': file.mimetype,
      };
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );
      const paymentReceipt = {
        transactionId: paymentReceiptDto?.transactionId,
        invoiceId: paymentReceiptDto?.invoiceId,
        serviceId: paymentReceiptDto?.serviceId,
        attachment: fileId,
      };
      result.paymentReceipt = paymentReceipt;
      result.initial.level = VendorStatusEnum.DOC;
      result.initial.status = VendorStatusEnum.SAVE;
      await this.isrVendorsRepository.save(result);
      foundObject.push(paymentReceipt);
      const paymentReceiptsData = result?.paymentReceipt;
      const length = paymentReceiptsData?.length;
      for (let index = 0; index < length; index++) {
        await this.invoiceRepository.update(
          paymentReceiptsData[index].invoiceId,
          {
            paymentStatus: 'Paid',
            attachment: fileId,
          },
        );
      }
      const response = new CreateFileDto();
      response.attachmentUrl = file?.path;
      response.originalName = file?.originalname;
      response.fileType = file?.mimetype;
      return paymentReceipt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /*
  Upload receipts of upgrade
  */
  async uploadPaymentAttachmentUpgrade(
    file: Express.Multer.File,
    user: any,
    paymentReceiptDto: any,
  ) {
    const userId = user.id;
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
      });
      if (!result) throw new HttpException('isr vendor not found ', 404);
      const fileUploadName = 'paymentReceipt';
      if (paymentReceiptDto?.attachment) {
        const objectName = `${userId}/${fileUploadName}/${paymentReceiptDto?.attachment}`;
        await this.minioClient.removeObject('megp', objectName);
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${file.originalname}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Testing': 1234,
      };
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );
      const paymentReceipt = {
        transactionNumber: paymentReceiptDto?.transactionNumber,
        invoiceId: paymentReceiptDto?.invoiceIds,
        attachment: fileId,
      };
      result.paymentReceipt = paymentReceipt;
      result.initial.level = VendorStatusEnum.DOC;
      result.initial.status = VendorStatusEnum.SAVE;
      await this.isrVendorsRepository.save(result);
      const ids = JSON.parse(paymentReceiptDto?.invoiceIds);
      for (let index = 0; index < ids.length; index++) {
        const invoice = await this.invoiceRepository.update(ids[index], {
          paymentStatus: PaymentStatus.PAID,
          attachment: fileId,
        });
        if (!invoice) throw new HttpException(`invoice_update _failed`, 500);
      }
      const invoices = await this.invoiceRepository.find({
        where: {
          id: In(ids),
          service: {
            businessProcesses: { isActive: true },

          },
        },
        relations: {
          service: {
            businessAreas: { isrVendor: true },
            businessProcesses: true
          },
        },
      });

      const wfi: CreateWorkflowInstanceDto = new CreateWorkflowInstanceDto();
      for (const row of invoices) {

        const businessArea = row.service.businessAreas[0];
        const ba = await this.busineAreaService.findOne(businessArea.id);
        if (ba.status == ApplicationStatus.PENDING) {
          wfi.bpId = row.service.businessProcesses[0].id;
          wfi.serviceId = row.serviceId;
          wfi.requestorId = businessArea.vendorId;
          //wfi.data = row.businessArea.isrVendor;
          const result = await this.workflowService.intiateWorkflowInstance(
            wfi,
            user,
          );
          businessArea.instanceId = result.application?.id;
          businessArea.applicationNumber =
            result.application?.applicationNumber;
          if (result) {
            await this.busineAreaService.update(businessArea.id, businessArea);
          }
        } else {
          const gotoNextDto = new GotoNextStateDto();
          gotoNextDto.action = 'ISR';
          gotoNextDto.instanceId = ba.instanceId;
          await this.workflowService.gotoNextStep(gotoNextDto, user);
        }
      }
      return paymentReceipt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async uploadPaymentReceiptAttachment(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ) {
    try {
      const userId = uploadFileDto.userInfo.id;
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
      });
      if (!result) throw new HttpException('isr vendor not found ', 500);
      const fileUploadName = 'paymentReceipt';
      if (uploadFileDto.attachment !== null) {
        const objectName = `${userId}/${fileUploadName}/${uploadFileDto.attachment}`;
        if (uploadFileDto.attachment || uploadFileDto.attachment !== '') {
          await this.minioClient.removeObject(this.bucketName, objectName);
        }
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${file.originalname}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const metaData = {
        'Content-Type': file.mimetype,
      };
      const resultData = await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );
      const paymentReceipt = {
        transactionId: uploadFileDto?.transactionNumber,
        invoiceIds: uploadFileDto?.invoiceIds,
        attachment: fileId,
      };
      result.paymentReceipt = paymentReceipt;
      result.initial.level = VendorStatusEnum.DOC;
      result.initial.status = VendorStatusEnum.SAVE;
      const isrVendor = await this.isrVendorsRepository.save(result);
      if (!isrVendor) throw new HttpException(`isrVendor_update _failed`, 500);
      for (let index = 0; index < uploadFileDto?.invoiceIds?.length; index++) {
        const invoice = await this.invoiceRepository.update(
          uploadFileDto?.invoiceIds[index],
          {
            paymentStatus: 'Paid',
            attachment: fileId,
          },
        );
        if (!invoice) throw new HttpException(`invoice_update _failed`, 500);
      }
      return paymentReceipt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async uploadSupportingDocumentAttachment(
    file: Express.Multer.File,
    userId: string,
    paymentReceiptDto: any,
  ) {
    try {
      const result = await this.isrVendorsRepository.findOne({
        where: { userId: userId, status: In(this.updateVendorEnums) },
      });
      if (!result) throw new HttpException('Incomplete Information', 404);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileUploadName = 'SupportingDocument';
      const fileId = `${uniqueSuffix}_${file.originalname}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const metaData = {
        'Content-Type': file.mimetype,
      };
      const fname = paymentReceiptDto.fieldName;
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );
      const resultMetadata = result.supportingDocuments;
      const fieldMapping = {
        businessRegistration_IncorporationCertificate:
          'businessRegistration_IncorporationCertificate',
        mRA_TPINCertificate: 'mRA_TPINCertificate',
        generalReceipt_BankDepositSlip: 'generalReceipt_BankDepositSlip',
        mRATaxClearanceCertificate: 'mRATaxClearanceCertificate',
        previousPPDARegistrationCertificate:
          'previousPPDARegistrationCertificate',
        mSMECertificate: 'mSMECertificate',
      };
      if (resultMetadata[fname] !== '') {
        const objectName = `${userId}/${fileUploadName}/${resultMetadata[fname]}`;
        await this.minioClient.removeObject(this.bucketName, objectName);
      }
      if (fieldMapping[paymentReceiptDto.fieldName]) {
        resultMetadata[fieldMapping[paymentReceiptDto.fieldName]] = fileId;
      }

      result.supportingDocuments = resultMetadata;
      const isrVendor = await this.isrVendorsRepository.save(result);
      if (!isrVendor) throw new HttpException(`isrVendor_update _failed`, 500);
      return isrVendor.supportingDocuments;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAttachmentpresignedObject(fileId: string) {
    try {
      const result = await this.minioClient.presignedGetObject(
        this.bucketName,
        fileId,
      );
      const httpsResult = result.replace(/^http:/, 'https:');
      return httpsResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getSupportingDocumentAttachmentpresignedObject(
    filename: string,
    userId,
  ) {
    try {
      const fileUploadName = 'SupportingDocument';
      const fileId = `${userId}/${fileUploadName}/${filename}`;
      const result = this.minioClient.presignedGetObject(
        this.bucketName,
        fileId,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async uploadCertificate(
    file: Express.Multer.File,
    userId: string,
    businessAreaId: string,
  ) {
    try {
      const result = await this.businessAreaRepository.findOne({
        where: { id: businessAreaId },
      });
      if (!result) throw new HttpException('business area not found ', 404);
      const fileUploadName = 'certificate';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${file.originalname}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const metaData = {
        'Content-Type': 'application/octet-stream',
      };
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );
      result.certificateUrl = fileId;
      const data = await this.businessAreaRepository.save(result);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async uploadCertificate2(file: Buffer, userId: string, instanceId: string) {
    console.log('user-id', userId);
    try {
      const result = await this.businessAreaRepository.findOne({
        where: { instanceId: instanceId },
      });
      if (!result) throw new HttpException('business area not found', 404);
      const fileUploadName = 'certificate';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${'certeficate.pdf'}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const metaData = {
        'Content-Type': 'application/octet-stream',
      };
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file,
        metaData,
      );
      result.certificateUrl = fileId;
      const data = await this.businessAreaRepository.save(result);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  /*
  upload any document in a user directory
  */
  async uploadDocuments(
    file: Express.Multer.File,
    user: any,
    subDirectory: string,
  ): Promise<string> {
    try {
      const filetype = this.getFileExtension(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${'certeficate.'}` + filetype;
      const filename = `${user.id}/${subDirectory}/${fileId}`;
      const metaData = {
        'Content-Type': 'application/octet-stream',
      };
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );
      return fileId;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  getFileExtension(fileName: string): string | null {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return null;
    }
    const extension = fileName.substring(lastDotIndex + 1);
    return extension.toLowerCase();
  }

  async getCertificate(filename: string, userId: string, res: Response) {
    try {
      const fileUploadName = 'certificate';
      const fileId = `${userId}/${fileUploadName}/${filename}`;
      const result = await this.minioClient.getObject('megp', fileId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileId}_certificate.pdf`,
      );
      result.pipe(res);
      // const result = this.minioClient.presignedGetObject(
      //   this.bucketName,
      //   fileId,
      // );

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getFile(
    userId: string,
    fielId: string,
    fileUploadName: string,
    @Res() res: Response,
  ) {
    try {
      const filename = `${userId}/${fileUploadName}/${fielId}`;
      const fileInfo = await this.minioClient.statObject('megp', filename);
      const contentType = fileInfo.metaData['content-type'];
      res.setHeader('Content-Type', contentType);
      return (await this.minioClient.getObject('megp', filename)).pipe(res);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async uploadBrifecase(file: Express.Multer.File, user: any): Promise<string> {
    try {
      const filetype = this.getFileExtension(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${'brifecase.'}` + filetype;
      const filename = `${user.id}/brifecase/${fileId}`;
      const metaData = {
        'Content-Type': 'application/octet-stream',
      };
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );

      return fileId;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
