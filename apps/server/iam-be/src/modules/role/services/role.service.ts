import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '@entities';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { RoleResponseDto } from '../dto/role.dto';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class RoleService extends ExtraCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly repositoryRole: Repository<Role>,
  ) {
    super(repositoryRole);
  }

  async findAllUnderOrganization(organizationId: any, query: CollectionQuery) {
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
