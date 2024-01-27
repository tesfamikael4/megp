import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './controllers/organization.controller';
import {
  Organization,
  User,
  OrganizationMandate,
  OrganizationType,
  UnitType,
  Unit,
  UserUnit,
  UserProfile,
  UserRole,
} from '@entities';
import { OrganizationService } from './services/organization.service';
import { OrganizationTypeController } from './controllers/organization-type.controller';
import { UnitTypeController } from './controllers/unit-type.controller';
import { UnitController } from './controllers/unit.controller';
import { UserController } from './controllers/user.controller';
import { OrganizationTypeService } from './services/organization-type.service';
import { UnitTypeService } from './services/unit-type.service';
import { UserService } from './services/user.service';
import { UnitService } from './services/unit.service';
import { UserUnitService } from './services/user-unit.service';
import { UserProfileService } from './services/user-profile.service';
import { UserRoleService } from '../role/services/user-role.service';
import { UserUnitController } from './controllers/user-unit.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserRoleController } from '../role/controllers/user-role.controller';
import { AccountModule } from '../account/account.module';
import { RoleSystemModule } from '../role-system/role-system.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationMandate,
      User,
      Unit,
      OrganizationType,
      UnitType,
      UserUnit,
      UserProfile,
      UserRole,
    ]),
    AccountModule,
    RoleSystemModule,
  ],
  providers: [
    OrganizationService,
    UserService,
    UnitService,
    OrganizationTypeService,
    UnitTypeService,
    UserUnitService,
    UserProfileService,
    UserRoleService,
  ],
  controllers: [
    OrganizationController,
    UserController,
    UnitController,
    OrganizationTypeController,
    UnitTypeController,
    UserUnitController,
    UserProfileController,
    UserRoleController,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
