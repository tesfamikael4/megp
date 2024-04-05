import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { MinioService } from 'nestjs-minio-client';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { BucketNameEnum } from './bucket-name.enum';

@Injectable()
export class MinIOService {
  constructor(private readonly minioService: MinioService) {}

  async upload(
    file: Express.Multer.File,
    bucketName: string,
    metaData = {},
  ): Promise<any> {
    try {
      const filepath = randomUUID() + extname(file.originalname);
      await this.minioService.client.putObject(
        BucketNameEnum.MEGP,
        bucketName + filepath,
        file.buffer,
        { ...metaData, 'Content-Type': file.mimetype },
      );
      return {
        filepath,
        bucketName,
        contentType: file.mimetype,
        originalname: file.originalname,
      };
    } catch (error) {
      throw error;
    }
  }

  async generatePresignedUploadUrl(fileInfo: {
    bucketName?: string;
    originalname: string;
    contentType?: string;
  }): Promise<{ presignedUrl: string; file: any }> {
    const filepath = randomUUID() + extname(fileInfo.originalname);

    const duration = Number(process.env.DURATION_OF_PRE_SIGNED_DOCUMENT ?? 120);
    const presignedUrl = await this.minioService.client.presignedPutObject(
      BucketNameEnum.MEGP,
      fileInfo.bucketName ? fileInfo.bucketName : '' + filepath,
      duration,
    );

    const file = {
      filepath,
      bucketName: fileInfo.bucketName,
      contentType: fileInfo.contentType,
      originalname: fileInfo.originalname,
    };

    return { presignedUrl, file };
  }

  async uploadBuffer(
    buffer: any,
    originalname: string,
    mimetype: string,
    bucketName: string,
    metaData = {},
  ): Promise<{
    filepath: string;
    bucketName: string;
    contentType: string;
    originalname: string;
  }> {
    try {
      const filepath = randomUUID() + extname(originalname);
      await this.minioService.client.putObject(
        BucketNameEnum.MEGP,
        bucketName + filepath,
        buffer,
        { ...metaData, 'Content-Type': mimetype },
      );
      return {
        filepath,
        bucketName,
        contentType: mimetype,
        originalname: originalname,
      };
    } catch (error) {
      throw error;
    }
  }

  async download(
    fileInfo: { bucketName: string; filepath: string; contentType?: string },
    response: Response,
  ) {
    const result = await this.minioService.client.getObject(
      BucketNameEnum.MEGP,
      fileInfo.bucketName + fileInfo.filepath,
    );

    response.setHeader('Content-Type', fileInfo.contentType);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileInfo.filepath}`,
    );
    result.pipe(response);

    return result;
  }

  async generatePresignedDownloadUrl(fileInfo: {
    bucketName: string;
    filepath: string;
    contentType?: string;
  }): Promise<string> {
    const duration = Number(process.env.DURATION_OF_PRE_SIGNED_DOCUMENT ?? 120);

    const presignedUrl = await this.minioService.client.presignedGetObject(
      BucketNameEnum.MEGP,
      fileInfo.bucketName + fileInfo.filepath,
      duration,
    );
    return presignedUrl;
  }

  async downloadBuffer(fileInfo: {
    bucketName: string;
    filepath: string;
    contentType?: string;
  }) {
    const result = await this.minioService.client.getObject(
      BucketNameEnum.MEGP,
      fileInfo.bucketName + fileInfo.filepath,
    );

    return result;
  }
}
