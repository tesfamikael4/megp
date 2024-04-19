import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederConstructor, runSeeder } from 'typeorm-extension';

import dataSource from 'src/shared/typeorm/typeorm-config-helper';
import {
  Account,
  Application,
  Mandate,
  Organization,
  Permission,
  RoleSystem,
  RoleSystemPermission,
  Unit,
  User,
} from 'src/entities';
import {
  applications,
  permissions,
  roleSystems,
  roleSystemPermissions,
  account,
  organization,
  user,
  unit,
  mandates,
} from './seed-data';
import * as bcrypt from 'bcrypt';

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

    const accountRepository: Repository<Account> =
      dataSource.getRepository(Account);

    const organizationRepository: Repository<Organization> =
      dataSource.getRepository(Organization);

    const unitRepository: Repository<Unit> = dataSource.getRepository(Unit);

    const userRepository: Repository<User> = dataSource.getRepository(User);

    const mandateRepository: Repository<Mandate> =
      dataSource.getRepository(Mandate);

    await applicationRepository.upsert(applications, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });

    // await permissionRepository.upsert(permissions, {
    //   skipUpdateIfNoValuesChanged: true,
    //   conflictPaths: ['key'],
    // });

    // await roleSystemRepository.upsert(roleSystems, {
    //   skipUpdateIfNoValuesChanged: true,
    //   conflictPaths: ['key'],
    // });

    // await roleSystemPermissionRepository.upsert(roleSystemPermissions, {
    //   skipUpdateIfNoValuesChanged: true,
    //   conflictPaths: ['roleSystemId', 'permissionId'],
    // });

    const accountExists = await accountRepository.findOne({
      where: {
        username: account.username,
      },
    });
    if (!accountExists) {
      const salt: string = bcrypt.genSaltSync(12);

      const password = bcrypt.hashSync('123456', salt);

      await accountRepository.insert({
        ...account,
        password,
      });

      await organizationRepository.insert(organization);

      await unitRepository.insert(unit);

      await userRepository.save(user);
    }

    await mandateRepository.save(mandates);
  }
}

const applicationSeederConstructor: SeederConstructor = DataSeeder;
(async () => {
  await runSeeder(dataSource, applicationSeederConstructor);
})();
