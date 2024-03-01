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

  async download(fileInfo: any) {
    return this.minIOService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(fileInfo: any): Promise<string> {
    const presignedUrl =
      await this.minIOService.generatePresignedDownloadUrl(fileInfo);
    return presignedUrl;
  }

  async upload(fileInfo: any): Promise<any> {
    const presignedUrl =
      await this.minIOService.generatePresignedUploadUrl(fileInfo);
    const itemData = {
      procurementRequisitionId: fileInfo.procurementRequisitionId,
      ...fileInfo,
    };
    const doc = this.repositoryProcurementRequisitionDocument.create(itemData);
    await this.repositoryProcurementRequisitionDocument.insert(doc);
    return presignedUrl;
  }
}
