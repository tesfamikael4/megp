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
import { WorkflowInstanceEntity } from './workflow-instances/entities/workflow-instance';
import { WorkflowInstanceService } from './workflow-instances/workflow-instance.service';
import { TaskHandlerEntity } from './workflow-instances/entities/task-handler';
import { WorkflowInstanceController } from './controllers/workflow-instance.controller';
import { TaskTrackerEntity } from './workflow-instances/entities/task-tracker';
import { InvoiceEntity } from './workflow-instances/entities/invoice.entity';
import { PaymentReceiptEntity } from './workflow-instances/entities/receipt-attachment';
import { ApplicationExcutionService } from './application-execution.service';
import { ApplicationExcutionController } from './application-execution.controller';
import { WorkflowEngineService } from 'src/shared/workflow-engine/workflow-engine.service';
import { VendorRegistrationModule } from 'src/vendor-registration/vendor-registration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BpServiceEntity,
      BusinessProcessEntity,
      TaskEntity,
    ]),
    // VendorRegistrationModule,
  ],
  exports: [
    BpServiceService,
    // WorkflowInstanceService,
    //   ApplicationExcutionService,
  ],
  providers: [
    BpServiceService,
    TaskService,
    // WorkflowInstanceService,
    WorkflowEngineService,
    //ApplicationExcutionService,
    BusinessProcessService,
  ],
  controllers: [
    BpServiceController,
    BusinessProcessController,
    TaskController,
    //  WorkflowInstanceController,
    //  ApplicationExcutionController,
  ],
})
export class BpmModule {}
