import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Mandate } from "./entities/mandate.entity";
import { MandateController } from "./controllers/mandate.controller";
import { MandateService } from "./services/mandate.service";
import { OrganizationMandate } from './entities/organization-mandate.entity';
import { OrganizationMandateController } from './controllers/organization-mandate.controller';
import { OrganizationMandateService } from './services/organization-mandate.service';
import { MandatePermission } from './entities/mandate-permission.entity';
import { MandatePermissionController } from './controllers/mandate-permission.controller';
import { MandatePermissionService } from './services/mandate-permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mandate, OrganizationMandate, MandatePermission])],
  providers: [MandateService, OrganizationMandateService, MandatePermissionService],
  controllers: [MandateController, OrganizationMandateController, MandatePermissionController],
})
export class MandateModule {}