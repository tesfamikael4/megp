import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application, Permission } from '@entities';
import { ApplicationNewController } from './controllers/application.controller';
import { ApplicationService } from './services/application.service';
import { PermissionNewController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Permission])],
  providers: [ApplicationService, PermissionService],
  controllers: [ApplicationNewController, PermissionNewController],
})
export class ApplicationModule {}
