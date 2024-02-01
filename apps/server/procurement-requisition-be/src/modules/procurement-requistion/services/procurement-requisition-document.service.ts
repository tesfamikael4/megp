import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProcurementRequisitionDocument } from 'src/entities';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class ProcurementRequisitionDocumentService extends ExtraCrudService<ProcurementRequisitionDocument> {
  constructor(
    @InjectRepository(ProcurementRequisitionDocument)
    private readonly repositoryProcurementRequisitionDocument: Repository<ProcurementRequisitionDocument>,
    private readonly minioService: MinioService,
  ) {
    super(repositoryProcurementRequisitionDocument);
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
    const doc = await this.repositoryProcurementRequisitionDocument.create({
      fileName: fileInfo.name,
      path: name,
      fileType: fileInfo.contentType,
      bucketName: fileInfo.bucketName,
      originalName: fileInfo.originalname,
      procurementRequisitionId: fileInfo.procurementRequisitionId,
      documentUrl: fileInfo.name,
    });
    await this.repositoryProcurementRequisitionDocument.insert(doc);
    return presignedUrl;
  }
}
