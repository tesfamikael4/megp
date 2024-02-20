import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserGroup } from '@entities';
import { RelationCrudService } from 'src/shared/service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from 'src/shared/api-data';
import { UserGroupResponseDto } from '../dto/user-group.dto';

@Injectable()
export class UserGroupService extends RelationCrudService<UserGroup> {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepository: Repository<UserGroup>,
  ) {
    super(groupRepository);
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

    const dataQuery = QueryConstructor.constructQuery<UserGroup>(
      this.groupRepository,
      query,
      true,
    );

    const response = new DataResponseFormat<UserGroupResponseDto>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = UserGroupResponseDto.toDtos(result);
    }
    return response;
  }
}
