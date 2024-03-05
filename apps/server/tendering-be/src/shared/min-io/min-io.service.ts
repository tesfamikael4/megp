import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinIOService {
  constructor(private readonly minioService: MinioService) {}

  async upload(
    file: Express.Multer.File,
    bucketName = 'megp',
    metaData = {},
  ): Promise<any> {
    try {
      const name = String(Date.now());
      await this.minioService.client.putObject(
        bucketName,
        name,
        file.buffer,
        metaData,
      );
      return {
        filepath: name,
        bucketName,
        contentType: file.mimetype,
        originalname: file.originalname,
      };
    } catch (error) {
      throw error;
    }
  }

  async generatePresignedUploadUrl(fileInfo: {
    bucketName: string;
    originalname: string;
    contentType?: string;
  }): Promise<{ presignedUrl: string; file: any }> {
    fileInfo.bucketName ??= 'megp';
    const duration = Number(process.env.DURATION_OF_PRE_SIGNED_DOCUMENT ?? 120);
    const name = String(Date.now());
    const presignedUrl = await this.minioService.client.presignedPutObject(
      fileInfo.bucketName,
      name,
      duration,
    );

    const file = {
      filepath: name,
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
    bucketName = 'megp',
    metaData = {},
  ): Promise<{
    filepath: string;
    bucketName: string;
    contentType: string;
    originalname: string;
  }> {
    try {
      const name = String(Date.now());
      await this.minioService.client.putObject(
        bucketName,
        name,
        buffer,
        metaData,
      );
      return {
        filepath: name,
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
    fileInfo.bucketName ??= 'megp';

    const result = await this.minioService.client.getObject(
      fileInfo.bucketName,
      fileInfo.filepath,
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
    fileInfo.bucketName ??= 'megp';
    const duration = Number(process.env.DURATION_OF_PRE_SIGNED_DOCUMENT ?? 120);

    const presignedUrl = await this.minioService.client.presignedGetObject(
      fileInfo.bucketName,
      fileInfo.filepath,
      duration,
    );
    return presignedUrl;
  }
}
