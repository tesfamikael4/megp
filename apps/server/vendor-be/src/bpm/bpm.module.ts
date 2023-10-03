import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BpServiceEntity } from '../services/entities/bp-service';
import { BpServiceService } from '../services/service.service';
import { BpServiceController } from '../services/bp-service.controller';
import { BusinessProcessEntity } from './entities/business-process';
import { TaskAssignmentEntity } from './entities/task-assignment';
import { TaskEntity } from './entities/task.entity';
import { BusinessProcessService } from './services/business-process.service';
import { TaskService } from './services/task.service';
import { BusinessProcessController } from './controllers/business-process.controller';
import { TaskController } from './controllers/task.controller';
import { WorkflowEngineService } from 'src/shared/workflow-engine/workflow-engine.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BpServiceEntity,
      BusinessProcessEntity,
      TaskEntity,
    ]),
  ],
  exports: [BpServiceService],
  providers: [
    BpServiceService,
    TaskService,
    WorkflowEngineService,
    BusinessProcessService,
  ],
  controllers: [BpServiceController, BusinessProcessController, TaskController],
})
export class BpmModule { }
