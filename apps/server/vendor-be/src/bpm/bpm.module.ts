import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BpServiceEntity } from './services/entities/bp-service';
import { BpServiceService } from './services/service.service';
import { BpServiceController } from './controllers/bp-service.controller';
import { BusinessProcessEntity } from './business-process/entities/business-process';
import { TaskAssignmentEntity } from './tasks/entities/task-assignment';
import { TaskEntity } from './tasks/entities/task.entity';
import { BusinessProcessService } from './business-process/business-process.service';
import { TaskService } from './tasks/task.service';
import { BusinessProcessController } from './controllers/business-process.controller';
import { TaskController } from './controllers/task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BpServiceEntity,
      BusinessProcessEntity,
      TaskEntity,
      TaskAssignmentEntity,
    ]),
  ],
  providers: [BpServiceService, BusinessProcessService, TaskService],
  controllers: [BpServiceController, BusinessProcessController, TaskController],
})
export class BpmModule {}
