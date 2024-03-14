import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class ClarificationDocumentService {
  constructor(private readonly minioService: MinIOService) {}

  async generatePresignedGetUrl(fileInfo: any): Promise<any> {
    const presignedUrl = await this.minioService.generatePresignedDownloadUrl({
      bucketName: fileInfo.fileInfo.bucketName,
      filepath: fileInfo.fileInfo.filepath,
      contentType: fileInfo.fileInfo.contentType,
    });
    return { presignedUrl };
  }

  async generatePresignedPutUrl(fileInfo): Promise<string> {
    const presignedUrl = await this.minioService.generatePresignedUploadUrl({
      bucketName: fileInfo.bucketName,
      contentType: fileInfo.contentType,
      originalname: fileInfo.originalname,
    });

    return presignedUrl.presignedUrl;
  }
}
