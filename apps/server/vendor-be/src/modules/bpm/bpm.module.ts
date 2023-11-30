import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BusinessProcessService } from './services/business-process.service';
import { TaskService } from './services/task.service';
import { BusinessProcessController } from './controllers/business-process.controller';
import { TaskController } from './controllers/task.controller';
import { WorkflowEngineService } from 'src/shared/workflow-engine/workflow-engine.service';
import { WorkflowService } from './services/workflow.service';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';

import { InvoiceEntity } from 'src/entities/invoice.entity';
import { PaymentReceiptEntity } from 'src/entities/receipt-attachment.entity';
import { HttpModule } from '@nestjs/axios';
import { TaskAssignmentService } from './services/task-assignment.service';
import { AuthorizationModule } from 'src/shared/authorization';
import { BusinessProcessEntity } from 'src/entities/business-process.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskAssignmentEntity } from 'src/entities/task-assignment.entity';
import { TaskHandlerEntity } from 'src/entities/task-handler.entity';
import { TaskTrackerEntity } from 'src/entities/task-tracker.entity';
import { HandlingCommonService } from '../handling/services/handling-common-services';
import { BpServiceController } from '../services/controllers/bp-service.controller';
import { ServiceModule } from '../services/service.module';
import { EmailService } from 'src/shared/email/email.service';
import { DataSeederController } from './controllers/data-seeder.controller';
import { ServicePricingModule } from '../pricing/pricing.module';
import { BanksEntity } from 'src/entities';
import { CategoriesModule } from '../categories/category.module';
import { VendorRegistrationModule } from '../vendor-registration/vendor-registration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessProcessEntity,
      TaskEntity,
      TaskAssignmentEntity,
      TaskHandlerEntity,
      TaskTrackerEntity,
      WorkflowInstanceEntity,
      InvoiceEntity,
      PaymentReceiptEntity,
      BanksEntity,
    ]),
    HttpModule,
    AuthorizationModule,
    ServiceModule,
    ServicePricingModule,
    CategoriesModule,
    forwardRef(() => VendorRegistrationModule)
  ],
  exports: [TaskService, BusinessProcessService, WorkflowService],
  providers: [
    WorkflowService,
    TaskService,
    TaskAssignmentService,
    WorkflowEngineService,
    BusinessProcessService,
    HandlingCommonService,
    EmailService,
  ],
  controllers: [
    BpServiceController,
    BusinessProcessController,
    TaskController,
    DataSeederController,
  ],
})
export class BpmModule { }
