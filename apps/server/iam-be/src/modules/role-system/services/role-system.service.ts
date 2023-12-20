import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleSystem } from '@entities';
import { EntityCrudService } from 'src/shared/service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class RoleSystemService extends EntityCrudService<RoleSystem> {
  constructor(
    @InjectRepository(RoleSystem)
    private readonly repositoryRole: Repository<RoleSystem>,
  ) {
    super(repositoryRole);
  }

  async findUnderOrganization(organizationId: string, query: CollectionQuery) {
    const dataQuery = QueryConstructor.constructQuery<RoleSystem>(
      this.repositoryRole,
      query,
    )
      .leftJoin('role_systems.roleSystemPermissions', 'roleSystemPermissions')
      .leftJoin('roleSystemPermissions.permission', 'permission')
      .leftJoin('permission.mandatePermissions', 'mandatePermissions')
      .leftJoin('mandatePermissions.mandate', 'mandate')
      .leftJoin('mandate.organizationMandates', 'organizationMandates')
      .andWhere('organizationMandates.organizationId=:organizationId', {
        organizationId,
      });

    const response = new DataResponseFormat<RoleSystem>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async getOrganizationAdministratorRole() {
    const ORGANIZATION_ADMINISTRATOR_KEY =
      process.env.ORGANIZATION_ADMINISTRATOR_KEY ??
      'ORGANIZATION_ADMINISTRATOR';

    const result = await this.repositoryRole.findOne({
      where: {
        key: ORGANIZATION_ADMINISTRATOR_KEY,
      },
    });

    return result;
  }
}
