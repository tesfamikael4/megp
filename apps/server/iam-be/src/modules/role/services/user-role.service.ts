import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRole } from '@entities';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from 'src/shared/api-data';
import { UserRoleResponseDto } from '../dto/user-role.dto';

@Injectable()
export class UserRoleService extends RelationCrudService<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    private readonly repositoryUserRole: Repository<UserRole>,
  ) {
    super(repositoryUserRole);
  }

  async findAllFirst(
    entityId: string,
    query: CollectionQuery,
    relationCrudOptions: RelationCrudOptions,
  ): Promise<any> {
    const entityIdName = relationCrudOptions.firstEntityIdName;
    const include = relationCrudOptions.firstInclude;
    const filterInclude = relationCrudOptions.secondInclude;

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

    const dataQuery = QueryConstructor.constructQuery<UserRole>(
      this.repositoryUserRole,
      query,
      true,
    );

    const response = new DataResponseFormat<UserRoleResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UserRoleResponseDto.toDtos(result);
    }
    return response;
  }
}
