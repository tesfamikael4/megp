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
import { VendorsBankEntity } from './entities/vendors-bank.entity';
import { ShareholdersEntity } from './entities/shareholder.entity';
import { FilesEntity } from './entities/file.entity';
import { BankAccountDetailService } from './services/bankAccountDetail.service';
import { BankAccountDetailEntity } from './entities/bank-account-detail.entity';
import { BankAccountDetailController } from './controllers/bankAccountDetail.controller';
import { ShareholderService } from './services/shareholder.service';
import { ShareholderController } from './controllers/shareholder.controller';
import { TinRegistrationDatabaseEntity } from './entities/tin-registration-database.entity';
import { TradeRegistrationDatabaseController } from './controllers/tradeRegistrationDatabase.controller';
import { TinRegistrationDatabaseController } from './controllers/tinRegistrationDatabase.controller';
import { NCICController } from './controllers/ncic.controller';
import { NCICService } from './services/ncic.service';
import { NCICEntity } from './entities/ncic.entity';
import { TradeRegistrationDatabaseEntity } from './entities/trade-registration-database.entity';
import { TradeRegistrationDatabaseService } from './services/trade-registration-database.service';
import { TinRegistrationDatabaseService } from './services/tin-registration-database.service';
import { FileController } from './controllers/file.controller';
// import { File } from './services/File';
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
import { TaskAssignmentEntity } from 'src/bpm/entities/task-assignment';
import { TaskHandlerEntity } from 'src/handling/entities/task-handler';
import { TaskTrackerEntity } from 'src/handling/entities/task-tracker';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicePrice,
      BusinessCategoryEntity,
      CustomCategoryEntity,
      VendorsEntity,
      BanksEntity,
      VendorsBankEntity,
      ShareholdersEntity,
      FilesEntity,
      BankAccountDetailEntity,
      TradeRegistrationDatabaseEntity,
      TinRegistrationDatabaseEntity,
      BeneficialOwnership,
      NCICEntity,
      WorkflowInstanceEntity,
      BpServiceEntity,
      BusinessProcessEntity,
      AreasOfBusinessInterestEntity,
      TaskAssignmentEntity,
      TaskHandlerEntity,
      TaskTrackerEntity,
      InvoiceEntity,
      PaymentReceiptEntity,
      TaskEntity,
    ]),
  ],
  exports: [],
  providers: [
    ServicePricingService,
    VendorBasicsService,
    BankAccountDetailService,
    ShareholderService,
    TradeRegistrationDatabaseService,
    TinRegistrationDatabaseService,
    NCICService,
    File,
    BeneficialOwnershipService,
    AreasOfBusinessInterestService,
    WorkflowInstanceService,
    ApplicationExcutionService,
    VendorRegistrationsService,
    HandlingCommonService
  ],
  controllers: [
    WorkflowInstanceController,
    ApplicationExcutionController,
    VendorRegistrationsController,
    ServicePricingController,
    VendorBasicsController,
    BankAccountDetailController,
    ShareholderController,
    TradeRegistrationDatabaseController,
    TinRegistrationDatabaseController,
    NCICController,
    FileController,
    BeneficialOwnershipController,
    AreasOfBusinessInterestController,
  ],
})
export class VendorRegistrationModule { }
