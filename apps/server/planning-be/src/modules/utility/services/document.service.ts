import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class DocumentService extends EntityCrudService<Document> {
  constructor(
    @InjectRepository(Document)
    private readonly repositoryDocument: Repository<Document>,
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
}
