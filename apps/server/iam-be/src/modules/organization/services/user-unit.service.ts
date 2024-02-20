import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserUnit } from '@entities';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from 'src/shared/api-data';
import { UserUnitResponseDto } from '../dto/user-unit.dto';

@Injectable()
export class UserUnitService extends RelationCrudService<UserUnit> {
  constructor(
    @InjectRepository(UserUnit)
    private readonly repositoryUserUnit: Repository<UserUnit>,
  ) {
    super(repositoryUserUnit);
  }

  async findAllSecond(
    entityId: string,
    query: CollectionQuery,
    relationCrudOptions: RelationCrudOptions,
  ): Promise<any> {
    const entityIdName = relationCrudOptions.secondEntityIdName;
    const include = relationCrudOptions.secondInclude;
    const filterInclude = relationCrudOptions.firstInclude;

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

    query.includes.push('user.account');

    const dataQuery = QueryConstructor.constructQuery<UserUnit>(
      this.repositoryUserUnit,
      query,
      true,
    );

    const response = new DataResponseFormat<UserUnitResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UserUnitResponseDto.toDtos(result);
    }
    return response;
  }
}
