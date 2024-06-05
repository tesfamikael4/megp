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
        bucketName ? bucketName + filepath : filepath,
        file.buffer,
        file.size,
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

  async generatePresignedUploadUrl(
    fileInfo: {
      originalname: string;
      contentType?: string;
    },
    bucketName = '',
  ): Promise<{ presignedUrl: string; file: any }> {
    const filepath = randomUUID() + extname(fileInfo.originalname);

    const duration = Number(process.env.DURATION_OF_PRE_SIGNED_DOCUMENT ?? 120);
    const presignedUrl = await this.minioService.client.presignedPutObject(
      BucketNameEnum.MEGP,
      bucketName ? bucketName + filepath : filepath,
      duration,
    );

    const file = {
      filepath,
      bucketName: bucketName,
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
    size?: number,
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
        bucketName ? bucketName + filepath : filepath,
        buffer,
        size,
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
      fileInfo.bucketName
        ? fileInfo.bucketName + fileInfo.filepath
        : fileInfo.filepath,
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
      fileInfo.bucketName
        ? fileInfo.bucketName + fileInfo.filepath
        : fileInfo.filepath,
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
      fileInfo.bucketName
        ? fileInfo.bucketName + fileInfo.filepath
        : fileInfo.filepath,
    );

    return result;
  }
}
