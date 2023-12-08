import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSystem, RoleSystemPermission } from '@entities';
import { RoleSystemController } from './controllers/role-system.controller';
import { RoleSystemService } from './services/role-system.service';
import { RoleSystemPermissionNewController } from './controllers/role-system-permission.controller';
import { RoleSystemPermissionService } from './services/role-system-permission.service';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleSystem, RoleSystemPermission]),
    ApplicationModule,
  ],
  providers: [RoleSystemService, RoleSystemPermissionService],
  controllers: [RoleSystemController, RoleSystemPermissionNewController],
  exports: [RoleSystemService],
})
export class RoleSystemModule {}
