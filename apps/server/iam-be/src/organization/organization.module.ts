import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';
import { Office } from './entities/office.entity';
import { Application } from './entities/application.entity';
import { User } from './entities/user.entity';
import { Mandate } from './entities/mandate.entity';
import { OrganizationMandate } from './entities/organization-mandate.entity';
import { OrganizationSector } from './entities/organization-sector.entity';
import { OrganizationType } from './entities/organization-type.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { SecurityQuestion } from './entities/security-question.entity';
import { UnitType } from './entities/unit-type.entity';
import { ApplicationController } from './controllers/application.controller';
import { MandateController } from './controllers/mandate.controller';
import { OrganizationSectorController } from './controllers/organization-sector.controller';
import { OrganizationTypeController } from './controllers/organization-type.controller';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { UnitTypeController } from './controllers/unit-type.controller';
import { UnitController } from './controllers/unit.controller';
import { UserController } from './controllers/user.controller';
import { ApplicationService } from './services/application.service';
import { MandateService } from './services/mandate.service';
import { OrganizationSectorService } from './services/organization-sector.service';
import { OrganizationTypeService } from './services/organization-type.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { UnitTypeService } from './services/unit-type.service';
import { UserService } from './services/user.service';
import { UnitService } from './services/unit.service';
import { Unit } from './entities/unit.entity';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationMandate,
      User,
      Unit,
      Role,
      Mandate,
      Application,
      Permission,
      SecurityQuestion,
      OrganizationType,
      UnitType,
      OrganizationSector,
      Office,
      RolePermission,
    ]),
  ],
  providers: [
    OrganizationService,
    MandateService,
    ApplicationService,
    RoleService,
    PermissionService,
    UserService,
    UnitService,
    OrganizationTypeService,
    UnitTypeService,
    OrganizationSectorService,
  ],
  controllers: [
    OrganizationController,
    MandateController,
    ApplicationController,
    RoleController,
    PermissionController,
    UserController,
    UnitController,
    OrganizationTypeController,
    UnitTypeController,
    OrganizationSectorController,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
