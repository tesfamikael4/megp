import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PreBudgetActivityDocument } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class PreBudgetActivityDocumentService extends ExtraCrudService<PreBudgetActivityDocument> {
  constructor(
    @InjectRepository(PreBudgetActivityDocument)
    private readonly repositoryPreBudgetActivityDocument: Repository<PreBudgetActivityDocument>,

    private readonly minioService: MinioService,
  ) {
    super(repositoryPreBudgetActivityDocument);
  }

  async listAllBuckets(): Promise<any> {
    const buckets = await this.minioService.client.listBuckets();
    return buckets;
  }

  async upload(file): Promise<any> {
    const bucketName = 'megp';
    const name = String(Date.now());
    await this.minioService.client.putObject(bucketName, name, file.buffer, {
      test: 'test',
    });
    return {
      filepath: name,
      bucketName,
      contentType: file.mimetype,
      originalname: file.originalname,
    };
  }

  async download(fileInfo) {
    return this.minioService.client.getObject(
      fileInfo.bucketName,
      fileInfo.path,
    );
  }

  async generatePresignedGetUrl(fileInfo): Promise<string> {
    const presignedUrl = await this.minioService.client.presignedGetObject(
      fileInfo.bucketName,
      fileInfo.path,
      120,
    );
    return presignedUrl;
  }

  async generatePresignedPutUrl(fileInfo): Promise<string> {
    fileInfo.bucketName = 'megp';
    const name = String(Date.now());
    const presignedUrl = await this.minioService.client.presignedPutObject(
      fileInfo.bucketName,
      name,
      120,
    );
    const doc = await this.repositoryPreBudgetActivityDocument.create({
      bucketName: fileInfo.bucketName,
      fileName: fileInfo.name,
      path: name,
      originalName: fileInfo.originalname,
      fileType: fileInfo.contentType,
      preBudgetPlanActivityId: fileInfo.preBudgetPlanActivityId,
      organizationId: fileInfo.organizationId,
    });
    await this.repositoryPreBudgetActivityDocument.insert(doc);
    return presignedUrl;
  }
}
