import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, RolePermission } from '@entities';
import { RoleNewController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { RolePermissionNewController } from './controllers/role-permission.controller';
import { RolePermissionService } from './services/role-permission.service';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission]),
    ApplicationModule,
  ],
  providers: [RoleService, RolePermissionService],
  controllers: [RoleNewController, RolePermissionNewController],
  exports: [RoleService],
})
export class RoleModule {}
