import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from 'src/entities/todo.entity';

import { EntityCrudService } from 'src/shared/service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class TodoService extends EntityCrudService<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {
    super(todoRepository);
  }

  async findAll(query: CollectionQuery, req?: any) {
    query.includes.push('items');

    query.where.push([
      {
        column: 'items.descriptionJson->>en',
        value: 'test',
        operator: FilterOperators.EqualTo,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<Todo>(
      this.todoRepository,
      query,
    );

    const response = new DataResponseFormat<Todo>();
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
