import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { Inject, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CollectionQuery, QueryConstructor } from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class EntityCrudService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async create(itemData: DeepPartial<T>, req?: any): Promise<T> {
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
    await this.findOneOrFail(id);
    await this.repository.update(id, itemData);
    return this.findOne(id);
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.findOneOrFail(id);
    await this.repository.softRemove(item);
  }

  async restore(id: string, req?: any): Promise<void> {
    await this.findOneOrFailWithDeleted(id);
    await this.repository.restore(id);
  }

  async findAllArchived(query: CollectionQuery, req?: any) {
    query.where.push([
      { column: 'deletedAt', value: '', operator: 'IsNotNull' },
    ]);

    const dataQuery = QueryConstructor.constructQuery<T>(
      this.repository,
      query,
    );

    dataQuery.withDeleted();

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

  private async findOneOrFail(id: any): Promise<T> {
    const item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException(`not_found`);
    }
    return item;
  }

  private async findOneOrFailWithDeleted(id: any): Promise<T> {
    const item = await this.repository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!item) {
      throw new NotFoundException(`not_found`);
    }
    return item;
  }
}
