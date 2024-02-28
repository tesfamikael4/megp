import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role, RolePermission } from '@entities';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { RoleResponseDto } from '../dto/role.dto';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { PermissionService } from 'src/modules/application/services/permission.service';

@Injectable()
export class RoleService extends ExtraCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly repositoryRole: Repository<Role>,
  ) {
    super(repositoryRole);
  }

  async findAllRoleForAssignment(
    organizationId: string,
    query: CollectionQuery,
  ) {
    const dataQuery = QueryConstructor.constructQuery<Role>(
      this.repositoryRole,
      query,
    )
      .leftJoin('roles.rolePermissions', 'rolePermissions')
      .leftJoin('rolePermissions.permission', 'permission')
      .leftJoin('permission.mandatePermissions', 'mandatePermissions')
      .leftJoin('mandatePermissions.mandate', 'mandate')
      .leftJoin('mandate.organizationMandates', 'organizationMandates')
      .andWhere('organizationMandates.organizationId=:organizationId', {
        organizationId,
      })
      .andWhere('roles.organizationId = :organizationId', { organizationId });

    const response = new DataResponseFormat<Role>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }

    return response;
  }

  async findAllRoleByPermission(
    organizationId: string,
    permission: string,
    query: CollectionQuery,
  ) {
    const dataQuery = QueryConstructor.constructQuery<Role>(
      this.repositoryRole,
      query,
    )
      .leftJoin('roles.rolePermissions', 'rolePermissions')
      .leftJoin(
        'rolePermissions.permission',
        'permission',
        'permission.key =:permission',
        { permission },
      )
      .leftJoin('permission.mandatePermissions', 'mandatePermissions')
      .leftJoin('mandatePermissions.mandate', 'mandate')
      .leftJoin('mandate.organizationMandates', 'organizationMandates')
      .andWhere('organizationMandates.organizationId=:organizationId', {
        organizationId,
      })
      .andWhere('roles.organizationId = :organizationId', { organizationId });

    const response = new DataResponseFormat<Role>();

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }

    return response;
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.repositoryRole.findOne({
      where: {
        id,
      },
      relations: {
        userRoles: true,
      },
      select: {
        id: true,
      },
    });
    if (item.userRoles.length > 0) {
      throw new BadRequestException(`cant_delete_role_with_users`);
    }
    await this.repositoryRole.softRemove(item);
  }
}
