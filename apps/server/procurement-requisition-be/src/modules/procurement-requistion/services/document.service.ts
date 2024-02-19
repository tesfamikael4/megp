import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { Document } from 'src/entities';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { FileResponseDto } from 'src/shared/domain';

@Injectable()
export class DocumentService extends ExtraCrudService<Document> {
  constructor(
    @InjectRepository(Document)
    private readonly repositoryDocument: Repository<Document>,
    private readonly minIOService: MinIOService,
  ) {
    super(repositoryDocument);
  }

  async download(fileInfo: FileResponseDto) {
    return this.minIOService.download(fileInfo, null);
  }

  async generatePresignedGetUrl(fileInfo: FileResponseDto): Promise<string> {
    const presignedUrl =
      await this.minIOService.generatePresignedDownloadUrl(fileInfo);
    return presignedUrl;
  }

  async create(fileInfo: FileResponseDto): Promise<string> {
    fileInfo.bucketName = 'megp';
    const presignedUrl =
      await this.minIOService.generatePresignedUploadUrl(fileInfo);
    const doc = this.repositoryDocument.create(fileInfo);
    await this.repositoryDocument.insert(doc);
    return presignedUrl;
  }
}
