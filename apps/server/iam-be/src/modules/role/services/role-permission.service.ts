import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RolePermission } from '@entities';
import { RelationCrudService } from 'src/shared/service/relation-crud.service';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class RolePermissionService extends RelationCrudService<RolePermission> {
  constructor(
    @InjectRepository(RolePermission)
    private readonly repositoryRolePermission: Repository<RolePermission>,
  ) {
    super(repositoryRolePermission);
  }

  async findAllPermission(
    roleId: string,
    organizationId: any,
    query: CollectionQuery,
  ) {
    return await this.getDataExtended(
      roleId,
      'roleId',
      'role',
      'permission',
      organizationId,
      query,
    );
  }

  async getDataExtended(
    entityId: string,
    entityIdName: string,
    include: string,
    filterInclude: string,
    organizationId: string,
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
        value: null,
        operator: FilterOperators.IsNull,
      },
    ]);

    query.where.push([
      {
        column: `${filterInclude}.deletedAt`,
        value: null,
        operator: FilterOperators.IsNull,
      },
    ]);

    query.includes.push(include);
    query.includes.push(filterInclude);

    const dataQuery = QueryConstructor.constructQuery<RolePermission>(
      this.repositoryRolePermission,
      query,
      true,
    )
      .leftJoin('permission.mandatePermissions', 'mandatePermissions')
      .leftJoin('mandatePermissions.mandate', 'mandate')
      .leftJoin('mandate.organizationMandates', 'organizationMandates')
      .andWhere('organizationMandates.organizationId=:organizationId', {
        organizationId,
      });

    const response = new DataResponseFormat<RolePermission>();

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
