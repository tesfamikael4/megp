import { IsNull, ObjectLiteral, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { RelationCrudOptions } from '../types/crud-option.type';

@Injectable()
export class RelationCrudService<TEntity extends ObjectLiteral> {
  constructor(private readonly repository: Repository<TEntity>) {}

  async bulkSaveFirst(payload: any, relationCrudOptions: RelationCrudOptions) {
    const firstEntityIdName = relationCrudOptions.firstEntityIdName;
    const secondEntityIdName = relationCrudOptions.secondEntityIdName;

    const include = relationCrudOptions.firstInclude;
    const entityId: string = payload[firstEntityIdName];

    const parsedPayload: any[] = [];

    const childData: any[] = payload[include];
    childData.forEach((data) => {
      parsedPayload.push({
        [firstEntityIdName]: entityId,
        [secondEntityIdName]: data,
      });
    });

    const deleteCondition = {};
    deleteCondition[firstEntityIdName] = entityId;

    await this.repository.delete(deleteCondition);

    const data = this.repository.create(parsedPayload);
    await this.repository.insert(data);
    return data;
  }

  async bulkSaveSecond(payload: any, relationCrudOptions: RelationCrudOptions) {
    const firstEntityIdName = relationCrudOptions.firstEntityIdName;
    const secondEntityIdName = relationCrudOptions.secondEntityIdName;

    const include = relationCrudOptions.secondInclude;
    const entityId: string = payload[secondEntityIdName];

    const parsedPayload: any[] = [];

    const childData: any[] = payload[include];
    childData.forEach((data) => {
      parsedPayload.push({
        [secondEntityIdName]: entityId,
        [firstEntityIdName]: data,
      });
    });

    const deleteCondition = {};
    deleteCondition[secondEntityIdName] = entityId;

    await this.repository.delete(deleteCondition);

    const data = this.repository.create(parsedPayload);
    await this.repository.insert(data);
    return data;
  }

  async findAllFirst(
    entityId: string,
    query: CollectionQuery,
    relationCrudOptions: RelationCrudOptions,
  ) {
    const entityIdName = relationCrudOptions.firstEntityIdName;
    const include = relationCrudOptions.firstInclude;
    const filterInclude = relationCrudOptions.secondInclude;

    return await this.getData(
      entityId,
      entityIdName,
      include,
      filterInclude,
      query,
    );
  }

  async findAllSecond(
    entityId: string,
    query: CollectionQuery,
    relationCrudOptions: RelationCrudOptions,
  ) {
    const entityIdName = relationCrudOptions.secondEntityIdName;
    const include = relationCrudOptions.secondInclude;
    const filterInclude = relationCrudOptions.firstInclude;

    return await this.getData(
      entityId,
      entityIdName,
      include,
      filterInclude,
      query,
    );
  }

  async getData(
    entityId: string,
    entityIdName: string,
    include: string,
    filterInclude: string,
    query: CollectionQuery,
  ) {
    query.where.push([
      {
        column: entityIdName,
        value: entityId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.where.push([
      {
        column: `${include}.deletedAt`,
        value: entityId,
        operator: FilterOperators.IsNull,
      },
    ]);

    query.where.push([
      {
        column: `${filterInclude}.deletedAt`,
        value: entityId,
        operator: FilterOperators.IsNull,
      },
    ]);

    query.includes.push(include);
    query.includes.push(filterInclude);

    const dataQuery = QueryConstructor.constructQuery<TEntity>(
      this.repository,
      query,
      true,
    );

    const response = new DataResponseFormat<TEntity>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
}
