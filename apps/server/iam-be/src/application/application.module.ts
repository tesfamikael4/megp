import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationNewController } from './controllers/application.controller';
import { ApplicationService } from './services/application.service';
import { Permission } from './entities/permission.entity';
import { PermissionNewController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Permission])],
  providers: [ApplicationService, PermissionService],
  controllers: [ApplicationNewController, PermissionNewController],
})
export class ApplicationModule {}
