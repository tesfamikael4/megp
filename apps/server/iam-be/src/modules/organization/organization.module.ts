import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './controllers/organization.controller';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './services/organization.service';
import { Office } from './entities/office.entity';
import { User } from './entities/user.entity';
import { OrganizationMandate } from './entities/organization-mandate.entity';
import { OrganizationSector } from './entities/organization-sector.entity';
import { OrganizationType } from './entities/organization-type.entity';
import { SecurityQuestion } from './entities/security-question.entity';
import { UnitType } from './entities/unit-type.entity';
import { OrganizationSectorController } from './controllers/organization-sector.controller';
import { OrganizationTypeController } from './controllers/organization-type.controller';
import { UnitTypeController } from './controllers/unit-type.controller';
import { UnitController } from './controllers/unit.controller';
import { UserController } from './controllers/user.controller';
import { OrganizationSectorService } from './services/organization-sector.service';
import { OrganizationTypeService } from './services/organization-type.service';
import { UnitTypeService } from './services/unit-type.service';
import { UserService } from './services/user.service';
import { UnitService } from './services/unit.service';
import { Unit } from './entities/unit.entity';
import { UserUnit } from './entities/user-unit.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserRole } from '../role/entities/user-role.entity';
import { UserUnitService } from './services/user-unit.service';
import { UserProfileService } from './services/user-profile.service';
import { UserRoleService } from '../role/services/user-role.service';
import { UserUnitController } from './controllers/user-unit.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserRoleController } from '../role/controllers/user-role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationMandate,
      User,
      Unit,
      SecurityQuestion,
      OrganizationType,
      UnitType,
      OrganizationSector,
      Office,
      UserUnit,
      UserProfile,
      UserRole,
    ]),
  ],
  providers: [
    OrganizationService,
    UserService,
    UnitService,
    OrganizationTypeService,
    UnitTypeService,
    OrganizationSectorService,
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
    OrganizationSectorController,
    UserUnitController,
    UserProfileController,
    UserRoleController,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
