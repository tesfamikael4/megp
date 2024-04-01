import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { MinIOService } from 'src/shared/min-io/min-io.service';
import { Document } from 'src/entities/document.entity';

@Injectable()
export class DocumentService extends EntityCrudService<Document> {
  constructor(
    @InjectRepository(Document)
    private readonly repositoryDocument: Repository<Document>,

    private readonly minIoService: MinIOService,
  ) {
    super(repositoryDocument);
  }

  async create(itemData: any, organization: any): Promise<any> {
    itemData.organizationId = organization.organizationId;
    itemData.organizationName = organization.organizationName;

    const doc = await this.repositoryDocument.findOne({
      where: {
        itemId: itemData.itemId,
        key: itemData.key,
      },
      order: {
        version: 'DESC',
      },
    });

    if (doc) {
      itemData.version = doc.version + 1;
    }

    const item = this.repositoryDocument.create(itemData);
    await this.repositoryDocument.insert(itemData);
    return item;
  }

  async generatePresignedGetUrl(id: string): Promise<string> {
    const document = await this.repositoryDocument.findOne({
      where: {
        id,
      },
    });
    if (!document) {
      throw new NotFoundException();
    }
    const presignedUrl = await this.minIoService.generatePresignedDownloadUrl({
      bucketName: document.fileInfo.bucketName,
      filepath: document.fileInfo.filepath,
      contentType: document.fileInfo.contentType,
    });
    return presignedUrl;
  }

  async getPresignedUrlWithDoc(id: string): Promise<any> {
    const document = await this.repositoryDocument.findOne({
      where: {
        itemId: id,
      },
    });
    if (!document) {
      throw new NotFoundException();
    }
    const presignedUrl = await this.minIoService.generatePresignedDownloadUrl({
      bucketName: document.fileInfo.bucketName,
      filepath: document.fileInfo.filepath,
      contentType: document.fileInfo.contentType,
    });
    return { presignedUrl, document };
  }

  async getDocumentByItemId(id: string): Promise<any> {
    const document = await this.repositoryDocument.findOne({
      where: {
        itemId: id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!document) {
      throw new NotFoundException();
    }
    const presignedUrl = await this.minIoService.generatePresignedDownloadUrl({
      bucketName: document.fileInfo.bucketName,
      filepath: document.fileInfo.filepath,
      contentType: document.fileInfo.contentType,
    });
    return { presignedUrl, document };
  }
  async getAllDocumentsByItemId(id: string): Promise<any> {
    return await this.repositoryDocument.find({
      where: {
        itemId: id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
