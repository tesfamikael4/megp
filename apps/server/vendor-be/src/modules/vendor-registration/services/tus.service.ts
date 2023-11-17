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
import { In, LessThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { UserInfo, userInfo } from 'os';
import { NestMinioService } from 'nestjs-minio';
import * as tusClient from 'tus-js-client';
import fs = require('fs');
import {
  FilesEntity,
  InvoiceEntity,
  IsrVendorsEntity,
  PaymentReceiptEntity,
  VendorsEntity,
} from 'src/entities';
import { VendorStatusEnum } from 'src/shared/enums/vendor-status-enums';
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
    @InjectRepository(IsrVendorsEntity)
    private readonly isrVendorRepository: Repository<IsrVendorsEntity>,
    @InjectRepository(PaymentReceiptEntity)
    private readonly paymentReceiptRepository: Repository<PaymentReceiptEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}
  private logger = new Logger('TusService');
  private readonly tusServer = new tus.Server(serverOptions);
  private userId = '';
  onModuleInit() {
    this.initializeTusServer();
  }

  async handleTus(req, res, userInfo) {
    const userId = userInfo.id;

    const result = await this.isrVendorRepository.findOne({
      where: {
        userId: userId,
        status: In([VendorStatusEnum.ACTIVE, VendorStatusEnum.ADJUSTMENT]),
      },
    });

    if (!result) throw new NotFoundException(`isr vendor not found`);

    const areaOfBusinessInterest = result.areasOfBusinessInterest;
    const invoice = await this.invoiceRepository.find({
      where: {
        payerAccountId: userId,
        paymentStatus: Not('Paid'),
      },
    });
    if (invoice.length > 0) {
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
        const paymentReceipt = [];
        if (entityName == 'vendor') {
          const resultMetadata = JSON.parse(
            JSON.stringify(result.supportingDocuments),
          );
          switch (fieldName) {
            case 'businessRegistration_IncorporationCertificate':
              resultMetadata.businessRegistration_IncorporationCertificate =
                fieldValue;
              break;
            case 'mRA_TPINCertificate':
              resultMetadata.mRA_TPINCertificate = fieldValue;
              break;
            case 'generalReceipt_BankDepositSlip':
              resultMetadata.generalReceipt_BankDepositSlip = fieldValue;
              break;
            case 'mRATaxClearanceCertificate':
              resultMetadata.mRATaxClearanceCertificate = fieldValue;
              break;
            case 'previousPPDARegistrationCertificate':
              resultMetadata.previousPPDARegistrationCertificate = fieldValue;
              break;
            case 'mSMECertificate':
              resultMetadata.mSMECertificate = fieldValue;
              break;
            default:
              break;
          }
          try {
            await this.isrVendorRepository.update(result.id, {
              paymentReceipt: resultMetadata,
            });
          } catch (error) {
            throw new BadRequestException(error);
          }
        } else if (entityName == 'paymentReceipt') {
          // const paymentReceipt = JSON.parse(
          //   JSON.stringify(result.paymentReceipt),
          // );
          paymentReceipt.push({
            transactionId: uploadMetadata?.transactionId,
            category: uploadMetadata?.category,
            invoiceId: uploadMetadata?.invoiceId,
            attachment: fieldValue,
          });
          try {
            await this.isrVendorRepository.update(result.id, {
              paymentReceipt: JSON.parse(JSON.stringify(paymentReceipt)),
            });
            await this.invoiceRepository.update(uploadMetadata.invoiceId, {
              paymentStatus: 'Paid',
              attachment: fieldValue,
            });
          } catch (error) {
            throw new BadRequestException(`Recept Upload failed`);
          }
        }
        this.logger.verbose(`Successfully inserted`);
      });
      return this.tusServer.handle(req, res);
    }
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
  async canUploadFile(userId: string) {
    const isrVendor = await this.isrVendorRepository.findOne({
      where: { userId: userId },
    });
    if (!isrVendor) throw new NotFoundException(`isrVendor Not Found`);
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
