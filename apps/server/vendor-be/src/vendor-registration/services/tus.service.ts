import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import tus = require('tus-node-server');
import * as Minio from 'minio';
import { FilesEntity } from '../entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo, userInfo } from 'os';
import { NestMinioService } from 'nestjs-minio';
import * as tusClient from 'tus-js-client';
import fs = require('fs');
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
  ) {}
  private logger = new Logger('TusService');
  private readonly tusServer = new tus.Server(serverOptions);
  private userId = '';
  onModuleInit() {
    this.initializeTusServer();
  }
  async handleTus(req, res, userId) {
    const bucketCreation = await minioClient
      .makeBucket(userId, '')
      .catch((e) => {
        this.logger.verbose(`MinioLog: '${userId}': ${e.message}`);
      });
    const minioStoreConfig1 = {
      partSize: 8 * 1024 * 1024, // Each uploaded part will have ~8MB,
      accessKeyId: process.env.ACCESSKEY,
      secretAccessKey: process.env.SECRETKEY,
      endpoint: endPointUrl,
      bucket: userId,
      s3ForcePathStyle: true,
      // signatureVersion: 'v2',
    };
    this.tusServer.datastore = new tus.S3Store(minioStoreConfig1);
    this.tusServer.on(tus.EVENTS.EVENT_FILE_CREATED, (event) => {
      this.logger.verbose(
        `Upload complete for file ${JSON.stringify(event.file)}`,
      );
    });
    this.tusServer.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
      this.logger.verbose(
        `Upload complete for file ${JSON.stringify(event.file)}`,
      );
      const uploadMetadataHeader = event.file.upload_metadata;
      const uploadMetadata = this.parseUploadMetadata(uploadMetadataHeader);
      const data = {
        fileType: uploadMetadata?.type,
        attachmentUrl: uploadMetadata?.name
          ? uploadMetadata?.name
          : 'attachment',
        vendorId: this.userId,
        path: uploadMetadata?.code ? uploadMetadata?.code : 'path',
        bucketName: uploadMetadata?.bucketName
          ? uploadMetadata?.bucketName
          : 'bucketName',
        fileName: event.file?.id,
        originalName: uploadMetadata?.name,
      };
      try {
        this.fileRepository.insert(data);
      } catch (error) {
        console.log(error);
      }

      this.logger.verbose(`Successfully inserted ${data}`);
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
    console.log('metadata metadata : ', metadata.metaData.upload_metadata);

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

  async deleteFileFromMinio(request, response, userId, fileName) {
    try {
      const [bucketName, objectName] = fileName.split('/');
      console.log('result: ', bucketName, ' objectName ', objectName);
      await minioClient.removeObject(bucketName, objectName + '.info');
      await minioClient.removeObject(bucketName, objectName);

      console.log(
        `File ${objectName} in bucket ${bucketName} has been deleted.`,
      );
      response.send(true);
      // return true
    } catch (error) {
      console.log;
    }
  }
}
