import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProcurementRequisitionDocument } from 'src/entities';
import { MinioService } from 'nestjs-minio-client';
import { MinIOService } from 'src/shared/min-io/min-io.service';

@Injectable()
export class ProcurementRequisitionDocumentService extends ExtraCrudService<ProcurementRequisitionDocument> {
  constructor(
    @InjectRepository(ProcurementRequisitionDocument)
    private readonly repositoryProcurementRequisitionDocument: Repository<ProcurementRequisitionDocument>,
    private readonly minioServiceBuiltIn: MinioService,
    private readonly minioService: MinIOService,
  ) {
    super(repositoryProcurementRequisitionDocument);
  }

  async generatePresignedPutUrl(fileInfo): Promise<string> {
    fileInfo.bucketName = 'megp';
    const name = String(Date.now());
    const presignedUrl =
      await this.minioServiceBuiltIn.client.presignedPutObject(
        fileInfo.bucketName,
        name,
        120,
      );
    const doc = this.repositoryProcurementRequisitionDocument.create({
      bucketName: fileInfo.bucketName,
      fileName: fileInfo.name,
      path: name,
      originalName: fileInfo.originalname,
      fileType: fileInfo.contentType,
      documentUrl: name,
      procurementRequisitionId: fileInfo.procurementRequisitionId,
    });
    await this.repositoryProcurementRequisitionDocument.insert(doc);
    return presignedUrl;
  }

  async download(fileInfo: any) {
    fileInfo.contentType = fileInfo.fileType;
    fileInfo.filepath = fileInfo.path;
    return this.minioService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(fileInfo): Promise<string> {
    fileInfo.contentType = fileInfo.fileType;
    fileInfo.filepath = fileInfo.path;
    const presignedUrl =
      await this.minioService.generatePresignedDownloadUrl(fileInfo);
    return presignedUrl;
  }
}
