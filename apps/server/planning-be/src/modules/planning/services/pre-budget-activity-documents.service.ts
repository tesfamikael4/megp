import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PreBudgetActivityDocument } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { MinioService } from 'nestjs-minio-client';
// import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class PreBudgetActivityDocumentService extends ExtraCrudService<PreBudgetActivityDocument> {
  constructor(
    @InjectRepository(PreBudgetActivityDocument)
    private readonly repositoryPreBudgetActivityDocument: Repository<PreBudgetActivityDocument>,

    private readonly minioService: MinIOService,
    private readonly minioClientService: MinioService,
  ) {
    super(repositoryPreBudgetActivityDocument);
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
    await this.minioClientService.client.putObject(
      bucketName,
      name,
      file.buffer,
      {
        test: 'test',
      },
    );
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
  async generatePresignedGetUrl(id: string): Promise<any> {
    const fileInfo = await this.repositoryPreBudgetActivityDocument.findOne({
      where: { id },
      select: { fileInfo: true },
    });
    if (!fileInfo) {
      throw new NotFoundException();
    }
    const presignedUrl = await this.minioService.generatePresignedDownloadUrl({
      bucketName: fileInfo.fileInfo.bucketName,
      filepath: fileInfo.fileInfo.filepath,
      contentType: fileInfo.fileInfo.contentType,
    });
    return { presignedUrl };
  }

  // ! deprecated method, do not use
  async generatePresignedPutUrl(
    fileInfo,
  ): Promise<{ presignedUrl: string; id: string }> {
    const presignedUrl = await this.minioService.generatePresignedUploadUrl({
      bucketName: fileInfo.bucketName,
      contentType: fileInfo.contentType,
      originalname: fileInfo.originalname,
    });

    const doc = await this.repositoryPreBudgetActivityDocument.create({
      title: fileInfo.name,
      preBudgetPlanActivityId: fileInfo.preBudgetPlanActivityId,
      organizationId: fileInfo.organizationId,
      fileInfo: presignedUrl.file,
    });

    await this.repositoryPreBudgetActivityDocument.insert(doc);
    return { presignedUrl: presignedUrl.presignedUrl, id: doc.id };
  }

  // ! deprecated method, do not use
  async uploadFailed(id: string): Promise<boolean> {
    await this.repositoryPreBudgetActivityDocument.delete({
      id,
    });
    return true;
  }
}
