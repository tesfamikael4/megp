import * as Minio from 'minio';
import * as Fs from 'fs';
import { Server } from '@tus/server';
import { S3Store } from '@tus/s3-store';

// import tus from 'tus-node-server';
// import tus from 'tus-js-client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateFileDto, DeleteFileDto } from '../dto/file.dto';
import { VendorRegistrationsService } from './vendor-registration.service';
import { FilesEntity, InvoiceEntity, IsrVendorsEntity } from 'src/entities';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
import { PaymentReceiptDto } from '../dto/payment-receipt.dto';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class File {
  private minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT_URL,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
  });

  constructor(
    @InjectRepository(FilesEntity)
    private readonly fileRepository: Repository<FilesEntity>,
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorsRepository: Repository<IsrVendorsEntity>,
    private readonly vendorRegistrationsService: VendorRegistrationsService,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}
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

  async getAttachmentpresignedObject(fileName: string) {
    try {
      const bucketName = 'megp';
      const result = this.minioClient.presignedGetObject(bucketName, fileName);
      return result;
    } catch (error) {
      console.log(error);
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
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    };
    console.log(
      'bucket : ',
      bucket,
      'filename : ',
      filename,
      'file.path : ',
      file.path,
      'metaData : ',
      metaData,
    );
    console.log(this.minioClient);
    this.minioClient.fPutObject(
      bucket,
      filename,
      file.path,
      metaData,
      function (err, etag) {
        console.log('the error is : ', err);
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
      'X-Amz-Meta-Testing': 1234,
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
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${userId}/${uniqueSuffix}_${file.filename}.${
        file.mimetype.split('/')[1]
      }`;
      const bucket = 'megp';
      const metaData = {
        'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
      };
      const resultData = await this.minioClient.putObject(
        bucket,
        filename,
        file.buffer,
        metaData,
      );
      const paymentReceipt = {
        transactionId: paymentReceiptDto?.transactionId,
        invoiceId: paymentReceiptDto?.invoiceId,
        serviceId: paymentReceiptDto?.serviceId,
        attachment: filename,
      };
      const isrVendor = await this.isrVendorsRepository.update(result.id, {
        paymentReceipt: JSON.parse(JSON.stringify(paymentReceipt)),
      });
      if (!isrVendor) throw new HttpException(`isrVendor_update _failed`, 500);
      const invoice = await this.invoiceRepository.update(
        paymentReceiptDto.invoiceId,
        {
          paymentStatus: 'Paid',
          attachment: resultData.etag,
        },
      );
      if (!invoice) throw new HttpException(`invoice_update _failed`, 500);

      const response = new CreateFileDto();
      response.attachmentUrl = file.path;
      response.originalName = file.originalname;
      response.fileType = file.mimetype;
      return paymentReceipt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // tusUpload(file: Express.Multer.File, command: CreateFileDto) {
  //   const fileBuffer = Fs.readFileSync(file.path);

  //   // Create a Blob object from the Buffer
  //   const blob = new Blob([fileBuffer], { type: file.mimetype });
  //   const tusClient = new tus.Upload(blob, {
  //     endpoint: '<tus-server-endpoint>',
  //     // resume: true,
  //     retryDelays: [0, 1000, 3000, 5000], // Retry delays in milliseconds
  //     metadata: {
  //       filename: '<file-name>',
  //       'Content-Type': '<content-type>',
  //     },
  //     onError: function (error) {
  //       console.log('Upload failed: ', error);
  //     },
  //     onProgress: function (bytesUploaded, bytesTotal) {
  //       const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
  //       console.log(`Upload progress: ${percentage}%`);
  //     },
  //     onSuccess: function () {
  //       console.log('Upload complete');
  //     },
  //   });
  // }
}
