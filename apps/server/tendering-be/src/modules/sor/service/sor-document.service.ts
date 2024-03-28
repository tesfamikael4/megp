import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { SorDocument } from 'src/entities/sor-document.entity';
import { MinIOService, BucketNameEnum } from 'src/shared/min-io';
import { CreateSorDocumentDto } from '../dto/sor-document.dto';

@Injectable()
export class SorDocumentService extends ExtraCrudService<SorDocument> {
  constructor(
    @InjectRepository(SorDocument)
    private readonly sorDocumentRepository: Repository<SorDocument>,
    private readonly minIOService: MinIOService,
  ) {
    super(sorDocumentRepository);
  }

  async create(itemData: CreateSorDocumentDto): Promise<any> {
    itemData.file.bucketName = BucketNameEnum.SOR_DOCUMENT;
    const file = await this.minIOService.generatePresignedUploadUrl(
      itemData.file as any,
    );

    const item = this.sorDocumentRepository.create(itemData);
    item.attachment = file.file;

    await this.sorDocumentRepository.insert(item);
    return { ...item, presignedUrl: file.presignedUrl };
  }

  async downloadDocument(id: string) {
    try {
      const document = await this.sorDocumentRepository.findOneBy({ id });
      if (!document) {
        throw new Error('Document not found');
      }
      if (!document.attachment) {
        throw new Error('Document attachment not found');
      }

      const presignedDownload =
        await this.minIOService.generatePresignedDownloadUrl(
          document.attachment,
        );
      return { presignedDownload };
    } catch (error) {
      throw error;
    }
  }
}
