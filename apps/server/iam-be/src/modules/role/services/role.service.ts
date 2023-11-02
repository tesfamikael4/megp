import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '@entities';
import { EntityCrudService } from 'src/shared/service/entity-crud.service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { RoleResponseDto } from '../dto/role.dto';

@Injectable()
export class RoleService extends EntityCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly repositoryRole: Repository<Role>,
  ) {
    super(repositoryRole);
  }
  async findAllUnderOrganization(organizationId, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<Role>(
      this.repositoryRole,
      query,
    )
      .innerJoin('roles.rolePermissions', 'rolePermissions')
      .innerJoin('rolePermissions.permission', 'permission')
      .orWhere('roles.organizationId = :organizationId', { organizationId })
      .orWhere('roles.organizationId IS NULL');
    const response = new DataResponseFormat<RoleResponseDto>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = RoleResponseDto.toDtos(result);
    }

    return response;
  }
}
