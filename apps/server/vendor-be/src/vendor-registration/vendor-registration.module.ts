import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorRegistrationsController } from './vendor-registration.controller';
import { VendorRegistrationsService } from './vendor-registration.service';
import { CustomCategoryEntity } from './entities/custom-category.entity';
import { BusinessCategoryEntity } from './entities/business-category.entity';
import { VendorBasicsController } from './vendors.controller';
import { VendorBasicsService } from './vendor-basics.service';
import { VendorsEntity } from './entities/vendors.entity';
import { BanksEntity } from './entities/bank.entity';
import { ShareholdersEntity } from './entities/shareholder.entity';
import { FilesEntity } from './entities/file.entity';
import { BankAccountDetailService } from './services/bankAccountDetail.service';
import { BankAccountDetailController } from './controllers/bankAccountDetail.controller';
import { ShareholderService } from './services/shareholder.service';
import { ShareholderController } from './controllers/shareholder.controller';
import { BeneficialOwnershipController } from './controllers/beneficialOwnership.controller';
import { BeneficialOwnershipService } from './services/beneficialOwnership.service';
import { BeneficialOwnership } from './entities/beneficial-ownership.entity';
import { WorkflowInstanceEntity } from 'src/handling/entities/workflow-instance';
import { File } from './services/file.service';
import { BpServiceEntity } from 'src/services/entities/bp-service';
import { BusinessProcessEntity } from 'src/bpm/entities/business-process';
import { AreasOfBusinessInterestController } from './controllers/areas-of-business-interest.controller';
import { AreasOfBusinessInterestService } from './services/areas-of-business-interest.service';
import { AreasOfBusinessInterestEntity } from './entities/areas-of-business-interest.entity';
import { WorkflowInstanceService } from 'src/handling/services/workflow-instance.service';
import { InvoiceEntity } from 'src/handling/entities/invoice.entity';
import { PaymentReceiptEntity } from 'src/handling/entities/receipt-attachment';
import { WorkflowInstanceController } from 'src/handling/controllers/workflow-instance.controller';
import { ApplicationExcutionController } from 'src/handling/controllers/application-execution.controller';
import { ApplicationExcutionService } from 'src/handling/services/application-execution.service';
import { TaskEntity } from 'src/bpm/entities/task.entity';
import { ServicePrice } from 'src/pricing/entities/service-price';
import { ServicePricingService } from 'src/pricing/service-pricing.service';
import { ServicePricingController } from 'src/pricing/service-pricing.controller';
import { HandlingCommonService } from 'src/handling/services/handling-common-services';
import { TusService } from './services/tus.service';
import { UploadController } from './controllers/file.controller';
import { TaskService } from 'src/bpm/services/task.service';
import { BusinessProcessService } from 'src/bpm/services/business-process.service';
import { BankAccountDetailEntity } from './entities/bank-account-detail.entity';
import { WorkflowService } from 'src/bpm/services/workflow.service';
import { BpmModule } from 'src/bpm/bpm.module';
import { TaskAssignmentEntity } from 'src/bpm/entities/task-assignment';
import { TaskHandlerEntity } from 'src/bpm/entities/task-handler';
import { TaskTrackerEntity } from 'src/bpm/entities/task-tracker';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicePrice,
      BusinessCategoryEntity,
      CustomCategoryEntity,
      VendorsEntity,
      BanksEntity,
      ShareholdersEntity,
      FilesEntity,
      BankAccountDetailEntity,
      BeneficialOwnership,
      AreasOfBusinessInterestEntity,
      PaymentReceiptEntity,
      //temporary, will be removed when modularization complete
      TaskEntity,
      WorkflowInstanceEntity,
      InvoiceEntity,
      TaskEntity,
      TaskAssignmentEntity,
      TaskHandlerEntity,
      TaskTrackerEntity,
      BusinessProcessEntity,
      BpServiceEntity,
    ]),
    BpmModule,
  ],
  exports: [],
  providers: [
    ServicePricingService,
    VendorBasicsService,
    TaskService,
    WorkflowService,
    BusinessProcessService,
    HandlingCommonService,
    BankAccountDetailService,
    ShareholderService,
    File,
    BeneficialOwnershipService,
    AreasOfBusinessInterestService,
    WorkflowInstanceService,
    ApplicationExcutionService,
    VendorRegistrationsService,
    TusService,
  ],
  controllers: [
    WorkflowInstanceController,
    ApplicationExcutionController,
    VendorRegistrationsController,
    ServicePricingController,
    VendorBasicsController,
    BankAccountDetailController,
    ShareholderController,
    UploadController,
    BeneficialOwnershipController,
    AreasOfBusinessInterestController,
  ],
})
export class VendorRegistrationModule {}
