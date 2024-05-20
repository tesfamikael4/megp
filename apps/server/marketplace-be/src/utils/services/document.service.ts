import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Document } from 'src/entities/document.entity';
import { EntityCrudService, MinIOService } from 'megp-shared-be';

@Injectable()
export class DocumentService extends EntityCrudService<Document> {
  constructor(
    @InjectRepository(Document)
    private readonly repositoryDocument: Repository<Document>,
    private dataSource: DataSource,
    private readonly minIoService: MinIOService,
  ) {
    super(repositoryDocument);
  }

  async create(itemData: any, user: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      itemData.organizationId = user?.organization?.organizationId;
      itemData.organizationName = user?.organization?.organizationName;
      itemData.userId = user?.id;

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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
        id,
      },
    });
    if (!document) {
      throw new NotFoundException('Document not found');
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
