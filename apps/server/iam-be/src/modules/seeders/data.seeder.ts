import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederConstructor, runSeeder } from 'typeorm-extension';

import dataSource from 'src/shared/typeorm/typeorm-config-helper';
import { Application, Permission, Role, RolePermission } from 'src/entities';
import { applications, permissions, roles, rolePermissions } from './seed-data';

@Injectable()
export class DataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await dataSource.initialize();

    const applicationRepository: Repository<Application> =
      dataSource.getRepository(Application);
    const permissionRepository: Repository<Permission> =
      dataSource.getRepository(Permission);
    const roleRepository: Repository<Role> = dataSource.getRepository(Role);
    const rolePermissionRepository: Repository<RolePermission> =
      dataSource.getRepository(RolePermission);

    await applicationRepository.upsert(applications, ['key']);

    await permissionRepository.upsert(permissions, ['key']);

    // await roleRepository.upsert(roles, {
    //     skipUpdateIfNoValuesChanged: true,
    //     conflictPaths: ['key'],
    // })

    // await rolePermissionRepository.upsert(rolePermissions, ["roleId", "permissionId"])
  }
}

const applicationSeederConstructor: SeederConstructor = DataSeeder;
(async () => {
  await runSeeder(dataSource, applicationSeederConstructor);
})();
