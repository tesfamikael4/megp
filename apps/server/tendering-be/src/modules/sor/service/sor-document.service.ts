import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { SorDocument } from 'src/entities/sor-document.entity';
import { MinIOService } from 'src/shared/min-io/min-io.service';
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
    const file = await this.minIOService.generatePresignedUploadUrl(
      itemData.file as any,
    );

    const item = this.sorDocumentRepository.create(itemData);
    item.attachment = file.file;

    await this.sorDocumentRepository.insert(item);
    return { ...item, presignedUrl: file.presignedUrl };
  }
}
