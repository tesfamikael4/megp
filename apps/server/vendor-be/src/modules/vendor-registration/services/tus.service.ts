import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import tus = require('tus-node-server');
import * as Minio from 'minio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo, userInfo } from 'os';
import { NestMinioService } from 'nestjs-minio';
import * as tusClient from 'tus-js-client';
import fs = require('fs');
import { FilesEntity, PaymentReceiptEntity, VendorsEntity } from 'src/entities';
const endPointUrl = `http://196.189.118.110:9000`;
const minioStoreConfig = {
  partSize: 8 * 1024 * 1024, // Each uploaded part will have ~8MB,
  accessKeyId: process.env.ACCESSKEY,
  secretAccessKey: process.env.SECRETKEY,
  endpoint: endPointUrl,
  s3ForcePathStyle: true,
  // signatureVersion: 'v2',
};
const serverOptions = {
  path: '/api/upload',
};
const minioClient = new Minio.Client({
  endPoint: '196.189.118.110',
  port: 9000,
  useSSL: false,
  accessKey: process.env.ACCESSKEY,
  secretKey: process.env.SECRETKEY,
});
@Injectable()
export class TusService implements OnModuleInit {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly fileRepository: Repository<FilesEntity>,
    @InjectRepository(VendorsEntity)
    private readonly vendorRepository: Repository<VendorsEntity>,
    @InjectRepository(PaymentReceiptEntity)
    private readonly paymentReceiptRepository: Repository<PaymentReceiptEntity>,
  ) {}
  private logger = new Logger('TusService');
  private readonly tusServer = new tus.Server(serverOptions);
  private userId = '';
  onModuleInit() {
    this.initializeTusServer();
  }
  async handleTus(req, res, userId) {
    const result = await this.vendorRepository.findOneOrFail({
      where: { userId: userId },
    });

    if (!result) throw new NotFoundException(`vendor not found`);
    const bucketCreation = await minioClient
      .makeBucket(userId, '')
      .catch((e) => {
        this.logger.verbose(`MinioLog: '${userId}': ${e.message}`);
      });
    const minioStoreConfig1 = {
      partSize: 8 * 1024 * 1024,
      accessKeyId: process.env.ACCESSKEY,
      secretAccessKey: process.env.SECRETKEY,
      endpoint: endPointUrl,
      bucket: userId,
      s3ForcePathStyle: true,
    };
    this.tusServer.datastore = new tus.S3Store(minioStoreConfig1);
    this.tusServer.on(tus.EVENTS.EVENT_FILE_CREATED, async (event) => {
      this.logger.verbose(
        `Upload Created for file ${JSON.stringify(event.file)}`,
      );
    });
    this.tusServer.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, async (event) => {
      this.logger.verbose(
        `Upload complete for file ${JSON.stringify(event.file)}`,
      );
      const uploadMetadataHeader = event.file.upload_metadata;
      const uploadMetadata = this.parseUploadMetadata(uploadMetadataHeader);
      const fieldValue = event.file.id;
      const fieldName = uploadMetadata?.fieldName;
      const entityName = uploadMetadata?.entityName;

      if (entityName == 'vendor') {
        const resultMetadata = JSON.parse(JSON.stringify(result.metaData));
        switch (fieldName) {
          case 'businessRegistration_IncorporationCertificate':
            resultMetadata.supportingDocuments.businessRegistration_IncorporationCertificate =
              fieldValue;
            break;
          case 'mRA_TPINCertificate':
            resultMetadata.supportingDocuments.mRA_TPINCertificate = fieldValue;
            break;
          case 'generalReceipt_BankDepositSlip':
            resultMetadata.supportingDocuments.generalReceipt_BankDepositSlip =
              fieldValue;
            break;
          case 'mRATaxClearanceCertificate':
            resultMetadata.supportingDocuments.mRATaxClearanceCertificate =
              fieldValue;
            break;
          case 'previousPPDARegistrationCertificate':
            resultMetadata.supportingDocuments.previousPPDARegistrationCertificate =
              fieldValue;
            break;
          case 'mSMECertificate':
            resultMetadata.supportingDocuments.mSMECertificate = fieldValue;
            break;
          default:
            break;
        }
        result.metaData = resultMetadata;
        try {
          await this.vendorRepository.save(result);
        } catch (error) {
          throw new BadRequestException(error);
        }
      } else if (entityName == 'paymentReceipt') {
        const resultMetadata = JSON.parse(JSON.stringify(result.metaData));
        const uploadMetadataHeader = event.file.upload_metadata;
        const uploadMetadata = this.parseUploadMetadata(uploadMetadataHeader);
        resultMetadata.paymentReceipt = {
          transactionId: uploadMetadata.transactionId,
          category: uploadMetadata.category,
          invoiceId: uploadMetadata.invoiceId,
          attachment: uploadMetadata.event.file.id,
        };
        try {
          result.metaData = resultMetadata;
          await this.vendorRepository.save(result);
        } catch (error) {
          throw new BadRequestException(`Recept Upload failed`);
        }
      }

      this.logger.verbose(`Successfully inserted`);
    });
    return this.tusServer.handle(req, res);
  }
  private async initializeTusServer() {
    this.logger.verbose(`Initializing Tus Server`);
  }
  private parseUploadMetadata(header: any): any {
    if (!header) {
      return null;
    }
    const metadataFields = header.split(',');
    const metadata: any = {};
    for (const field of metadataFields) {
      const [key, value] = field.split(' ');
      metadata[key] = Buffer.from(value, 'base64').toString();
    }
    return metadata;
  }
  async getFileFromMinio(request, response, userId, fileName) {
    const [bucketName, objectName] = fileName.split('/');

    const metadata = await minioClient.statObject(bucketName, objectName);

    const fileStream = await minioClient.getObject(bucketName, objectName);
    const uploadMetadataHeader = metadata.metaData.upload_metadata;
    const uploadMetadata = this.parseUploadMetadata(uploadMetadataHeader);

    response.setHeader('Content-Type', uploadMetadata.type);
    response.setHeader(
      'Content-Disposition',
      `filename="${uploadMetadata.name}"`,
    );
    // Pipe the file stream to the response
    fileStream.pipe(response);
  }
  async getFile(request, response, userId, fileName) {
    const bucketName = userId;
    const objectName = fileName;
    const metadata = await minioClient.statObject(bucketName, objectName);

    const fileStream = await minioClient.getObject(bucketName, objectName);
    const uploadMetadataHeader = metadata.metaData.upload_metadata;
    const uploadMetadata = this.parseUploadMetadata(uploadMetadataHeader);

    response.setHeader('Content-Type', uploadMetadata.type);
    response.setHeader(
      'Content-Disposition',
      `filename="${uploadMetadata.name}"`,
    );
    fileStream.pipe(response);
  }
  async deleteFileFromMinio(request, response, userId, fileName) {
    try {
      const [bucketName, objectName] = fileName.split('/');
      await minioClient.removeObject(bucketName, objectName + '.info');
      await minioClient.removeObject(bucketName, objectName);
      response.send(true);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
