import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorRegistrationsController } from './controllers/vendor-registration.controller';
import { VendorRegistrationsService } from './services/vendor-registration.service';
import { BankAccountDetailService } from './services/bank-account-detail.service';
import { BankAccountDetailController } from './controllers/bank-account-detail.controller';
import { ShareholderService } from './services/shareholder.service';
import { ShareholderController } from './controllers/shareholder.controller';
import { BeneficialOwnershipController } from './controllers/beneficial-ownership.controller';
import { BeneficialOwnershipService } from './services/beneficial-ownership.service';
import { File } from './services/file.service';
import { AreasOfBusinessInterestController } from './controllers/areas-of-business-interest.controller';
import { AreasOfBusinessInterestService } from './services/areas-of-business-interest.service';
import { TusService } from './services/tus.service';
import { UploadController } from './controllers/file.controller';
import { BusinessAreaController } from './controllers/business-area.controller';
import { BusinessAreaService } from './services/business-area.service';
import { AuthorizationModule } from 'src/shared/authorization';
import {
  AreasOfBusinessInterestEntity,
  BankAccountDetailEntity,
  BanksEntity,
  BeneficialOwnership,
  BpServiceEntity,
  BusinessAreaEntity,
  BusinessCategoryEntity,
  BusinessProcessEntity,
  CustomCategoryEntity,
  FilesEntity,
  InvoiceEntity,
  IsrVendorsEntity,
  PaymentReceiptEntity,
  ServicePrice,
  ShareholdersEntity,
  TaskAssignmentEntity,
  TaskHandlerEntity,
  TaskTrackerEntity,
  VendorsEntity,
  WorkflowInstanceEntity,
} from 'src/entities';
import { BpmModule } from 'src/modules/bpm/bpm.module';
import { ServicePricingService } from 'src/modules/pricing/services/service-pricing.service';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';
import { WorkflowInstanceService } from 'src/modules/handling/services/workflow-instance.service';
import { ApplicationExcutionService } from 'src/modules/handling/services/application-execution.service';
import { WorkflowInstanceController } from 'src/modules/handling/controllers/workflow-instance.controller';
import { ApplicationExcutionController } from 'src/modules/handling/controllers/application-execution.controller';
import { ServicePricingController } from 'src/modules/pricing/controllers/service-pricing.controller';
import { CategoriesModule } from '../categories/category.module';

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
      BpServiceEntity,
      //temporary, will be removed when modularization complete
      WorkflowInstanceEntity,
      InvoiceEntity,
      TaskAssignmentEntity,
      TaskHandlerEntity,
      TaskTrackerEntity,
      BusinessAreaEntity,
      BusinessProcessEntity,
      IsrVendorsEntity,
    ]),
    AuthorizationModule,
    BpmModule,
    CategoriesModule,
  ],
  exports: [],
  providers: [
    ServicePricingService,
    HandlingCommonService,
    BankAccountDetailService,
    ShareholderService,
    File,
    BeneficialOwnershipService,
    AreasOfBusinessInterestService,
    WorkflowInstanceService,
    ApplicationExcutionService,
    VendorRegistrationsService,
    BusinessAreaService,
    TusService,
  ],
  controllers: [
    WorkflowInstanceController,
    ApplicationExcutionController,
    VendorRegistrationsController,
    ServicePricingController,
    BankAccountDetailController,
    ShareholderController,
    UploadController,
    BeneficialOwnershipController,
    AreasOfBusinessInterestController,
    BusinessAreaController,
  ],
})
export class VendorRegistrationModule {}
