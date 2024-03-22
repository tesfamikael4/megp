import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { ExtraCrudOptions } from '../types/crud-option.type';

@Injectable()
export class ExtraCrudService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async create(itemData: DeepPartial<any>, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    const item = this.repository.create(itemData);
    await this.repository.insert(item);
    return item;
  }

  async findAll(
    entityId: string,
    query: CollectionQuery,
    extraCrudOptions: ExtraCrudOptions,
    req?: any,
  ) {
    const entityIdName = extraCrudOptions.entityIdName;

    query.where.push([
      {
        column: entityIdName,
        value: entityId,
        operator: FilterOperators.EqualTo,
      },
    ]);

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

  async findAllArchived(
    entityId: string,
    query: CollectionQuery,
    extraCrudOptions: ExtraCrudOptions,
    req?: any,
  ) {
    query.where.push([
      { column: 'deletedAt', value: '', operator: 'IsNotNull' },
    ]);

    const entityIdName = extraCrudOptions.entityIdName;

    query.where.push([
      {
        column: entityIdName,
        value: entityId,
        operator: FilterOperators.EqualTo,
      },
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
    const item = await this.repository.findOne(id);
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
