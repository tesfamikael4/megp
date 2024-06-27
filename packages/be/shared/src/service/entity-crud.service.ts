import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '../collection-query';
import { DataResponseFormat } from '../api-data';

@Injectable()
export class EntityCrudService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async create(itemData: DeepPartial<any>, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.organizationName;
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
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, itemData: any): Promise<T | undefined> {
    const item = await this.findOneOrFail(id);
    await this.repository.update(item.id, itemData);
    return {
      ...item,
      ...itemData,
    };
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
      { column: 'deletedAt', value: '', operator: FilterOperators.IsNotNull },
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
    const item = await this.repository.findOneBy({ id });
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
