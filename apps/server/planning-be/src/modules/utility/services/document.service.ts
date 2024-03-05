import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
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

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }

    const item = this.repositoryDocument.create(itemData);
    await this.repositoryDocument.insert(itemData);
    return item;
  }

  async generatePresignedGetUrl(id: string): Promise<string> {
    const document = await this.repositoryDocument.findOne({
      where: {
        id: id,
      },
      select: {
        fileInfo: true,
      },
    });
    if (!document) {
      throw new HttpException('file not found', 404);
    }
    const presignedUrl = await this.minIoService.generatePresignedDownloadUrl({
      bucketName: document.fileInfo.bucketName,
      filepath: document.fileInfo.name,
    });
    return presignedUrl;
  }
}
