import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProcurementRequisitionDocument } from 'src/entities';
import { MinIOService } from 'src/shared/min-io';

@Injectable()
export class ProcurementRequisitionDocumentService extends ExtraCrudService<ProcurementRequisitionDocument> {
  constructor(
    @InjectRepository(ProcurementRequisitionDocument)
    private readonly repositoryProcurementRequisitionDocument: Repository<ProcurementRequisitionDocument>,
    private readonly minIOService: MinIOService,
  ) {
    super(repositoryProcurementRequisitionDocument);
  }

  async download(id: string): Promise<any> {
    const { fileInfo }: any =
      await this.repositoryProcurementRequisitionDocument.findOne({
        where: { id },
        select: { fileInfo: true },
      });
    return this.minIOService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(id: string): Promise<any> {
    const { fileInfo }: any =
      await this.repositoryProcurementRequisitionDocument.findOne({
        where: { id },
        select: { fileInfo: true },
      });
    return await this.minIOService.generatePresignedDownloadUrl(fileInfo);
  }

  async upload(user: any, file: any): Promise<any> {
    const preSignedUrl = await this.minIOService.generatePresignedUploadUrl(
      file.fileInfo,
    );
    const documentData = {
      fileInfo: preSignedUrl.file,
      procurementRequisitionId: file.procurementRequisitionId,
      title: file.title,
      organizationId: user.organization.id,
      organizationName: user.organization.name,
    };
    const doc =
      this.repositoryProcurementRequisitionDocument.create(documentData);
    await this.repositoryProcurementRequisitionDocument.insert(doc);
    return { ...doc, presignedUrl: preSignedUrl.presignedUrl };
  }
}
