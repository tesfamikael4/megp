import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederConstructor, runSeeder } from 'typeorm-extension';

import dataSource from 'src/shared/typeorm/typeorm-config-helper';
import {
  Application,
  Permission,
  RoleSystem,
  RoleSystemPermission,
} from 'src/entities';
import {
  applications,
  permissions,
  roleSystems,
  roleSystemPermissions,
} from './seed-data';

@Injectable()
export class DataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await dataSource.initialize();

    const applicationRepository: Repository<Application> =
      dataSource.getRepository(Application);

    const permissionRepository: Repository<Permission> =
      dataSource.getRepository(Permission);

    const roleSystemRepository: Repository<RoleSystem> =
      dataSource.getRepository(RoleSystem);

    const roleSystemPermissionRepository: Repository<RoleSystemPermission> =
      dataSource.getRepository(RoleSystemPermission);

    await applicationRepository.upsert(applications, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });

    await permissionRepository.upsert(permissions, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });

    await roleSystemRepository.upsert(roleSystems, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });

    await roleSystemPermissionRepository.upsert(roleSystemPermissions, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['roleSystemId', 'permissionId'],
    });
  }
}

const applicationSeederConstructor: SeederConstructor = DataSeeder;
(async () => {
  await runSeeder(dataSource, applicationSeederConstructor);
})();
