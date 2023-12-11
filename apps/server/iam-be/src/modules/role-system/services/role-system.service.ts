import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleSystem, RolePermission } from '@entities';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { PermissionService } from 'src/modules/application/services/permission.service';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class RoleSystemService extends EntityCrudService<RoleSystem> {
  constructor(
    @InjectRepository(RoleSystem)
    private readonly repositoryRole: Repository<RoleSystem>,
    private readonly permissionService: PermissionService,
  ) {
    super(repositoryRole);
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
