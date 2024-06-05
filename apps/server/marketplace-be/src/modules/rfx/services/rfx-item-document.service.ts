import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService, MinIOService } from 'megp-shared-be';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RfxItemDocument } from 'src/entities';
import { CreateRfxItemDocumentDto } from '../dtos/rfx-document.dto';

@Injectable()
export class RfxItemDocumentService extends ExtraCrudService<RfxItemDocument> {
  constructor(
    @InjectRepository(RfxItemDocument)
    private readonly rfxItemDocumentRepository: Repository<RfxItemDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly minIOService: MinIOService,
  ) {
    super(rfxItemDocumentRepository);
  }

  async create(itemData: CreateRfxItemDocumentDto): Promise<any> {
    const file = await this.minIOService.generatePresignedUploadUrl(
      itemData.fileInfo as any,
      'marketplace/',
    );

    const item = this.rfxItemDocumentRepository.create(itemData);
    item.fileInfo = file.file;

    await this.rfxItemDocumentRepository.upsert(item, ['rfxItemId', 'key']);
    return { ...item, presignedUrl: file.presignedUrl };
  }

  async downloadDocument(id: string) {
    try {
      const document = await this.rfxItemDocumentRepository.findOneBy({ id });
      if (!document) {
        throw new Error('Document not found');
      }
      if (!document.fileInfo) {
        throw new Error('Document attachment not found');
      }

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(document.fileInfo);
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }
}
