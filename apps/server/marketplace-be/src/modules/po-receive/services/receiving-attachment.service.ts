import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService, MinIOService } from 'megp-shared-be';
import { ReceivingAttachment } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class ReceivingAttachmentService extends ExtraCrudService<ReceivingAttachment> {
  constructor(
    @InjectRepository(ReceivingAttachment)
    private readonly receivingAttachmentRepository: Repository<ReceivingAttachment>,
    private readonly minIOService: MinIOService,
  ) {
    super(receivingAttachmentRepository);
  }

  async download(id: string): Promise<any> {
    const { fileInfo }: any = await this.receivingAttachmentRepository.findOne({
      where: { id },
      select: { fileInfo: true },
    });
    return this.minIOService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(id: string): Promise<any> {
    const { fileInfo }: any = await this.receivingAttachmentRepository.findOne({
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
      receivingNoteId: file.receivingNoteId,
      title: file.title,
      organizationId: user.organization.id,
      organizationName: user.organization.name,
    };
    const doc = this.receivingAttachmentRepository.create(documentData);
    await this.receivingAttachmentRepository.insert(doc);
    return { ...doc, presignedUrl: preSignedUrl.presignedUrl };
  }
}
