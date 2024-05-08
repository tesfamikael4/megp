import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from 'src/shared/service';
import { PostBudgetActivityDocument } from 'src/entities/post-budget-activity-document.entity';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class PostBudgetActivityDocumentService extends ExtraCrudService<PostBudgetActivityDocument> {
  constructor(
    @InjectRepository(PostBudgetActivityDocument)
    private readonly repositoryPostBudgetActivityDocument: Repository<PostBudgetActivityDocument>,

    private readonly minioService: MinIOService,
    private readonly minioClientService: MinioService,
  ) {
    super(repositoryPostBudgetActivityDocument);
  }

  // ! deprecated method, do not use
  async listAllBuckets(): Promise<any> {
    const buckets = await this.minioClientService.client.listBuckets();
    return buckets;
  }

  // ! deprecated method, do not use
  async upload(file): Promise<any> {
    const bucketName = 'megp';
    const name = String(Date.now());
    // await this.minioClientService.client.putObject(
    //   bucketName,
    //   name,
    //   file.buffer,
    //   {
    //     test: 'test',
    //   },
    // );
    return {
      filepath: name,
      bucketName,
      contentType: file.mimetype,
      originalname: file.originalname,
    };
  }

  // ! deprecated method, do not use
  async download(fileInfo) {
    return this.minioClientService.client.getObject(
      fileInfo.bucketName,
      fileInfo.path,
    );
  }

  // ! deprecated method, do not use
  async generatePresignedGetUrl(fileInfo): Promise<string> {
    const presignedUrl = await this.minioService.generatePresignedDownloadUrl({
      bucketName: fileInfo.bucketName,
      filepath: fileInfo.name,
    });
    return presignedUrl;
  }

  // ! deprecated method, do not use
  async generatePresignedPutUrl(fileInfo): Promise<{ presignedUrl: string }> {
    const presignedUrl = await this.minioService.generatePresignedUploadUrl({
      bucketName: fileInfo.bucketName,
      contentType: fileInfo.contentType,
      originalname: fileInfo.originalname,
    });

    const doc = await this.repositoryPostBudgetActivityDocument.create({
      title: fileInfo.name,
      postBudgetPlanActivityId: fileInfo.postBudgetPlanActivityId,
      organizationId: fileInfo.organizationId,
      fileInfo: presignedUrl.file,
    });

    await this.repositoryPostBudgetActivityDocument.insert(doc);
    return { presignedUrl: presignedUrl.presignedUrl };
  }
}
