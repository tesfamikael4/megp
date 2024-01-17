import * as Minio from 'minio';
import {
  HttpException,
  Injectable,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateFileDto, DeleteFileDto, UploadFileDto } from '../dto/file.dto';
import { VendorRegistrationsService } from './vendor-registration.service';
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
import { CreateWorkflowInstanceDto } from 'src/modules/handling/dto/workflow-instance.dto';
import { PreferentailTreatmentService } from 'src/modules/preferentials/services/preferentail-treatment.service';

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
    private readonly vendorRegistrationsService: VendorRegistrationsService,
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
      const fileEntity = CreateFileDto.fromDto(fileDto);
      return await this.fileRepository.save(fileEntity);
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
      if (!result) throw new HttpException('isr vendor not found ', 500);
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
      const resultData = await this.minioClient.putObject(
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
      const isrVendor = await this.isrVendorsRepository.save(result);

      foundObject.push(paymentReceipt);
      if (!isrVendor) throw new HttpException(`isrVendor_update _failed`, 500);
      const paymentReceiptsData = result?.paymentReceipt;

      for (let index = 0; index < paymentReceiptsData?.length; index++) {
        const invoice = await this.invoiceRepository.update(
          paymentReceiptsData[index].invoiceId,
          {
            paymentStatus: 'Paid',
            attachment: fileId,
          },
        );
        if (!invoice) throw new HttpException(`invoice_update _failed`, 500);
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
      if (!result) throw new HttpException('isr vendor not found ', 500);
      const fileUploadName = 'paymentReceipt';
      const paymentReceipts = result.paymentReceipt;
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
      const isrVendor = await this.isrVendorsRepository.save(result);
      if (!isrVendor) throw new HttpException(`isrVendor_update _failed`, 500);
      const ids = JSON.parse(paymentReceiptDto?.invoiceIds);
      for (let index = 0; index < ids.length; index++) {
        const invoice = await this.invoiceRepository.update(ids[index], {
          paymentStatus: 'Paid',
          attachment: fileId,
        });
        if (!invoice) throw new HttpException(`invoice_update _failed`, 500);
      }
      const invoices = await this.invoiceRepository.find({
        where: {
          id: In(ids),
          businessArea: {
            BpService: {
              businessProcesses: { isActive: true },
            },
          },
        },
        relations: {
          businessArea: {
            BpService: { businessProcesses: true },
            isrVendor: true,
          },
        },
      });

      const wfi: CreateWorkflowInstanceDto = new CreateWorkflowInstanceDto();
      for (let index = 0; index < invoices.length; index++) {
        const row = invoices[index];
        const businessArea = invoices[index].businessArea;
        wfi.bpId = row.businessArea.BpService.businessProcesses[0].id;
        wfi.serviceId = row.businessArea.serviceId;
        wfi.requestorId = row.businessArea.vendorId;
        wfi.data = row.businessArea.isrVendor;
        const result = await this.workflowService.intiateWorkflowInstance(
          wfi,
          user,
        );
        businessArea.instanceId = result.application?.id;
        businessArea.applicationNumber = result.application?.applicationNumber;
        if (result) {
          await this.busineAreaService.update(businessArea.id, businessArea);
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
        // const fileAlreadyUploaded = await this.minioClient.statObject(this.bucketName, objectName)
        // if (fileAlreadyUploaded) return "file already uploaded"
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
        transactionId: uploadFileDto?.transactionId,
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
      if (!result) throw new HttpException('isr vendor not found ', 500);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileUploadName = 'SupportingDocument';
      const fileId = `${uniqueSuffix}_${file.originalname}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const bucket = 'megp';
      const metaData = {
        'Content-Type': file.mimetype,
      };
      const fname = paymentReceiptDto.fieldName;
      const resultData = await this.minioClient.putObject(
        bucket,
        filename,
        file.buffer,
        metaData,
      );
      const resultMetadata = JSON.parse(
        JSON.stringify(result.supportingDocuments),
      );
      switch (paymentReceiptDto.fieldName) {
        case 'businessRegistration_IncorporationCertificate':
          if (resultMetadata[fname] !== '') {
            const objectName = `${userId}/${fileUploadName}/${resultMetadata[fname]}`;
            await this.minioClient.removeObject('megp', objectName);
          }
          resultMetadata.businessRegistration_IncorporationCertificate = fileId;
          break;
        case 'mRA_TPINCertificate':
          if (resultMetadata[fname] !== '') {
            const objectName = `${userId}/${fileUploadName}/${resultMetadata[fname]}`;
            await this.minioClient.removeObject('megp', objectName);
          }
          resultMetadata.mRA_TPINCertificate = fileId;
          break;
        case 'generalReceipt_BankDepositSlip':
          if (resultMetadata[fname] !== '') {
            const objectName = `${userId}/${fileUploadName}/${resultMetadata[fname]}`;
            await this.minioClient.removeObject('megp', objectName);
          }
          resultMetadata.generalReceipt_BankDepositSlip = fileId;
          break;
        case 'mRATaxClearanceCertificate':
          if (resultMetadata[fname] !== '') {
            const objectName = `${userId}/${fileUploadName}/${resultMetadata[fname]}`;
            await this.minioClient.removeObject('megp', objectName);
          }
          resultMetadata.mRATaxClearanceCertificate = fileId;
          break;
        case 'previousPPDARegistrationCertificate':
          if (resultMetadata[fname] !== '') {
            const objectName = `${userId}/${fileUploadName}/${resultMetadata[fname]}`;
            await this.minioClient.removeObject('megp', objectName);
          }
          resultMetadata.previousPPDARegistrationCertificate = fileId;
          break;
        case 'mSMECertificate':
          if (resultMetadata[fname] !== '') {
            const objectName = `${userId}/${fileUploadName}/${resultMetadata[fname]}`;
            await this.minioClient.removeObject('megp', objectName);
          }
          resultMetadata.mSMECertificate = fileId;
          break;
        default:
          break;
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
      if (!result) throw new HttpException('business area not found ', 500);
      const fileUploadName = 'certificate';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${file.originalname}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const metaData = {
        'Content-Type': 'application/octet-stream',
      };
      const resultData = await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        metaData,
      );
      result.certificateUrl = fileId;
      const data = await this.businessAreaRepository.save(result);
      if (!result) throw new HttpException('business area update failed', 500);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async uploadCertificate2(
    file: Buffer,
    userId: string,
    businessAreaId: string,
  ) {
    console.log('user-id', userId);
    try {
      const result = await this.businessAreaRepository.findOne({
        where: { id: businessAreaId },
      });
      if (!result) throw new HttpException('business area not found', 404);
      const fileUploadName = 'certificate';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${'certeficate.pdf'}`;
      const filename = `${userId}/${fileUploadName}/${fileId}`;
      const metaData = {
        'Content-Type': 'application/octet-stream',
      };
      const resultData = await this.minioClient.putObject(
        this.bucketName,
        filename,
        file,
        metaData,
      );
      result.certificateUrl = fileId;
      const data = await this.businessAreaRepository.save(result);
      if (!result) throw new HttpException('business area update failed', 500);

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
    subDirectory: string
  ): Promise<string> {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileId = `${uniqueSuffix}_${'certeficate.pdf'}`;
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

  async getFile(userId: string, fielId: string, fileUploadName: string, @Res() res: Response) {
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
}
