import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService, MinIOService } from 'megp-shared-be';
import { POAttachment } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class POAttachmentService extends ExtraCrudService<POAttachment> {
  constructor(
    @InjectRepository(POAttachment)
    private readonly poAttachmentRepository: Repository<POAttachment>,
    private readonly minIOService: MinIOService,
  ) {
    super(poAttachmentRepository);
  }

  async download(id: string): Promise<any> {
    const { fileInfo }: any = await this.poAttachmentRepository.findOne({
      where: { id },
      select: { fileInfo: true },
    });
    return this.minIOService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(id: string): Promise<any> {
    const { fileInfo }: any = await this.poAttachmentRepository.findOne({
      where: { id },
      select: { fileInfo: true },
    });
    const presignedUrl =
      await this.minIOService.generatePresignedDownloadUrl(fileInfo);
    return { presignedUrl };
  }

  async upload(user: any, file: any): Promise<any> {
    const bucketName = '';
    const preSignedUrl = await this.minIOService.generatePresignedUploadUrl(
      file,
      bucketName,
    );
    const documentData = {
      fileInfo: preSignedUrl.file,
      purchaseOrderId: file.purchaseOrderId,
      title: file.title,
      organizationId: user.organization.id,
      organizationName: user.organization.name,
    };
    const doc = this.poAttachmentRepository.create(documentData);
    await this.poAttachmentRepository.insert(doc);
    return { ...doc, presignedUrl: preSignedUrl.presignedUrl };
  }
}
