import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mandate, OrganizationMandate, MandatePermission } from '@entities';
import { MandateController } from './controllers/mandate.controller';
import { MandateService } from './services/mandate.service';
import { OrganizationMandateController } from './controllers/organization-mandate.controller';
import { OrganizationMandateService } from './services/organization-mandate.service';
import { MandatePermissionController } from './controllers/mandate-permission.controller';
import { MandatePermissionService } from './services/mandate-permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mandate, OrganizationMandate, MandatePermission]),
  ],
  providers: [
    MandateService,
    OrganizationMandateService,
    MandatePermissionService,
  ],
  controllers: [
    MandateController,
    OrganizationMandateController,
    MandatePermissionController,
  ],
})
export class MandateModule {}
