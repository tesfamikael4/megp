import { Repository, DeepPartial } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CollectionQuery, QueryConstructor } from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { BaseEntity } from '../entities/base.entity';

@Injectable()
export class EntityCrudService<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async create(itemData: DeepPartial<T>, req?: any): Promise<T> {
    const item = this.repository.create(itemData);
    return await this.repository.save(item);
  }

  async findAll(query: CollectionQuery, req?: any) {
    const dataQuery = QueryConstructor.constructQuery<T>(
      this.repository,
      query,
    );

    const d = dataQuery.getQuery();

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
    await this.findOneOrFail(id);
    await this.repository.update(id, itemData);
    return this.findOne(id);
  }

  async remove(id: string, req?: any): Promise<void> {
    await this.findOneOrFail(id);
    await this.repository.delete(id);
  }

  private async findOneOrFail(id: any): Promise<T> {
    const item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException(`not_found`);
    }
    return item;
  }
}
