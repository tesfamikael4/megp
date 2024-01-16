import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { MinioService } from 'nestjs-minio-client';
import { PostBudgetActivityDocument } from 'src/entities/post-budget-activity-document.entity';

@Injectable()
export class PostBudgetActivityDocumentService extends ExtraCrudService<PostBudgetActivityDocument> {
  constructor(
    @InjectRepository(PostBudgetActivityDocument)
    private readonly repositoryPostBudgetActivityDocument: Repository<PostBudgetActivityDocument>,

    private readonly minioService: MinioService,
  ) {
    super(repositoryPostBudgetActivityDocument);
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
    const postsignedUrl = await this.minioService.client.presignedGetObject(
      fileInfo.bucketName,
      fileInfo.path,
      120,
    );
    return postsignedUrl;
  }

  async generatePresignedPutUrl(fileInfo): Promise<string> {
    fileInfo.bucketName = 'megp';
    const name = String(Date.now());
    const presignedUrl = await this.minioService.client.presignedPutObject(
      fileInfo.bucketName,
      name,
      120,
    );
    const doc = await this.repositoryPostBudgetActivityDocument.create({
      bucketName: fileInfo.bucketName,
      fileName: fileInfo.name,
      path: name,
      originalName: fileInfo.originalname,
      fileType: fileInfo.contentType,
      postBudgetPlanActivityId: fileInfo.postBudgetPlanActivityId,
      organizationId: fileInfo.organizationId,
    });
    await this.repositoryPostBudgetActivityDocument.insert(doc);
    return presignedUrl;
  }
}
