import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { ProcurementRequisitionDocument } from 'src/entities';
import { MinIOService } from 'src/shared/min-io/min-io.service';

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

  async upload(organizationId: string, fileInfo: any): Promise<any> {
    const { file: presignedUrl } =
      await this.minIOService.generatePresignedUploadUrl(fileInfo);
    const documentData = {
      fileInfo: presignedUrl,
      procurementRequisitionId: fileInfo.procurementRequisitionId,
      organizationId: organizationId,
    };
    await this.repositoryProcurementRequisitionDocument.insert(
      this.repositoryProcurementRequisitionDocument.create(documentData),
    );
    return presignedUrl.presignedUrl;
  }
}
