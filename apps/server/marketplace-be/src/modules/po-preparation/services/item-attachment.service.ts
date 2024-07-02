import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService, MinIOService } from 'megp-shared-be';
import { ItemAttachment } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class ItemAttachmentService extends ExtraCrudService<ItemAttachment> {
  constructor(
    @InjectRepository(ItemAttachment)
    private readonly itemAttachmentRepository: Repository<ItemAttachment>,
    private readonly minIOService: MinIOService,
  ) {
    super(itemAttachmentRepository);
  }

  async download(id: string): Promise<any> {
    const { fileInfo }: any = await this.itemAttachmentRepository.findOne({
      where: { id },
      select: { fileInfo: true },
    });
    return this.minIOService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(id: string): Promise<any> {
    const { fileInfo }: any = await this.itemAttachmentRepository.findOne({
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
      poItemId: file.poItemId,
      title: file.title,
      organizationId: user.organization.id,
      organizationName: user.organization.name,
    };
    const doc = this.itemAttachmentRepository.create(documentData);
    await this.itemAttachmentRepository.insert(doc);
    return { ...doc, presignedUrl: preSignedUrl.presignedUrl };
  }
}
