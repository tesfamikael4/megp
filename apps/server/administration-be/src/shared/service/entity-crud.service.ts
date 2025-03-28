import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CollectionQuery, QueryConstructor } from '../collection-query';
import { DataResponseFormat } from '../api-data';

@Injectable()
export class EntityCrudService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async create(itemData: DeepPartial<any>, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    const item = this.repository.create(itemData);
    await this.repository.insert(item);
    return item;
  }

  async findAll(query: CollectionQuery, req?: any) {
    const dataQuery = QueryConstructor.constructQuery<T>(
      this.repository,
      query,
    );

    const response = new DataResponseFormat<T>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async findOne(id: any, req?: any): Promise<T | undefined> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, itemData: any): Promise<T | undefined> {
    const item = await this.findOneOrFail(id);
    await this.repository.update(id, itemData);
    return { ...item, ...itemData };
  }

  async delete(id: string, req?: any): Promise<void> {
    const item = await this.findOneOrFail(id);
    await this.repository.remove(item);
  }

  private async findOneOrFail(id: any): Promise<T> {
    const item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException(`not_found`);
    }
    return item;
  }
}
