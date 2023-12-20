import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSystem, RoleSystemPermission, UserRoleSystem } from '@entities';
import { RoleSystemController } from './controllers/role-system.controller';
import { RoleSystemService } from './services/role-system.service';
import { RoleSystemPermissionController } from './controllers/role-system-permission.controller';
import { RoleSystemPermissionService } from './services/role-system-permission.service';
import { ApplicationModule } from '../application/application.module';
import { UserRoleSystemController } from './controllers/user-role-system.controller';
import { UserRoleSystemService } from './services/user-role-system.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleSystem,
      RoleSystemPermission,
      UserRoleSystem,
    ]),
    ApplicationModule,
  ],
  providers: [
    RoleSystemService,
    RoleSystemPermissionService,
    UserRoleSystemService,
  ],
  controllers: [
    RoleSystemController,
    RoleSystemPermissionController,
    UserRoleSystemController,
  ],
  exports: [RoleSystemService],
})
export class RoleSystemModule {}
