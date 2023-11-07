import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BpServiceEntity } from '../services/entities/bp-service';
import { BpServiceService } from '../services/service.service';
import { BpServiceController } from '../services/bp-service.controller';
import { BusinessProcessEntity } from './entities/business-process';
import { TaskEntity } from './entities/task.entity';
import { BusinessProcessService } from './services/business-process.service';
import { TaskService } from './services/task.service';
import { BusinessProcessController } from './controllers/business-process.controller';
import { TaskController } from './controllers/task.controller';
import { WorkflowEngineService } from 'src/shared/workflow-engine/workflow-engine.service';
import { WorkflowService } from './services/workflow.service';
import { WorkflowInstanceEntity } from 'src/handling/entities/workflow-instance';
import { TaskHandlerEntity } from './entities/task-handler';
import { TaskTrackerEntity } from './entities/task-tracker';
import { TaskAssignmentEntity } from './entities/task-assignment';
import { InvoiceEntity } from 'src/handling/entities/invoice.entity';
import { PaymentReceiptEntity } from 'src/handling/entities/receipt-attachment';
import { HandlingCommonService } from 'src/handling/services/handling-common-services';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BpServiceEntity,
      BusinessProcessEntity,
      TaskEntity,
      TaskAssignmentEntity,
      TaskHandlerEntity,
      TaskTrackerEntity,
      WorkflowInstanceEntity,
      InvoiceEntity,
      PaymentReceiptEntity,
    ]),
    HttpModule
  ],
  exports: [
    BpServiceService,
    TaskService,
    BusinessProcessService,
    WorkflowService,
  ],
  providers: [
    BpServiceService,
    WorkflowService,
    TaskService,
    WorkflowEngineService,
    BusinessProcessService,
    HandlingCommonService,
  ],
  controllers: [BpServiceController, BusinessProcessController, TaskController],
})
export class BpmModule { }
