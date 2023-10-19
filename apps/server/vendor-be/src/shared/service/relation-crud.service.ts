import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from '../collection-query';
import { DataResponseFormat } from '../api-data';
import { BaseEntity } from '../entities/base.entity';
import { RelationCrudOptions } from '../types/crud-option.type';

@Injectable()
export class RelationCrudService<TEntity extends BaseEntity> {
  constructor(private readonly repository: Repository<TEntity>) {}

  async bulkSave(payload: any, relationCrudOptions: RelationCrudOptions) {
    const firstEntityIdName = relationCrudOptions.firstEntityIdName;
    const secondEntityIdName = relationCrudOptions.secondEntityIdName;

    const include = relationCrudOptions.firstInclude;
    const entityId: string = payload[firstEntityIdName];

    const parsedPayload: any[] = [];

    const childData: any[] = payload[include];
    childData.forEach((data) => {
      // const child = {};
      // child[firstEntityIdName] = entityId
      // child[secondEntityIdName] = data

      // parsedPayload.push(child);

      parsedPayload.push({
        [firstEntityIdName]: entityId,
        [secondEntityIdName]: data,
      });
    });

    const deleteCondition = {};
    deleteCondition[firstEntityIdName] = entityId;

    await this.repository.delete(deleteCondition);

    const data = this.repository.create(parsedPayload);
    return await this.repository.save(data);
  }

  async findAllFirst(
    entityId: string,
    query: CollectionQuery,
    relationCrudOptions: RelationCrudOptions,
  ) {
    const entityIdName = relationCrudOptions.firstEntityIdName;
    const include = relationCrudOptions.firstInclude;

    return await this.getData(entityId, entityIdName, include, query);
  }

  async findAllSecond(
    entityId: string,
    query: CollectionQuery,
    relationCrudOptions: RelationCrudOptions,
  ) {
    const entityIdName = relationCrudOptions.secondEntityIdName;
    const include = relationCrudOptions.secondInclude;

    return await this.getData(entityId, entityIdName, include, query);
  }

  async getData(
    entityId: string,
    entityIdName: string,
    include: string,
    query: CollectionQuery,
  ) {
    query.filter.push([
      {
        field: entityIdName,
        value: entityId,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.includes.push(include);

    const dataQuery = QueryConstructor.constructQuery<TEntity>(
      this.repository,
      query,
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
