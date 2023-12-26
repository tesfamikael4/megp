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
import { InvoiceService } from './services/invoice.service';
import { HttpModule } from '@nestjs/axios';
import { FileService } from './services/file.service';
import { ServicePricingModule } from '../pricing/pricing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
      BusinessAreaEntity,
      //temporary, will be removed when modularization complete
      WorkflowInstanceEntity,
      ServicePrice,
      InvoiceEntity,
      TaskAssignmentEntity,
      TaskHandlerEntity,
      TaskTrackerEntity,
      BpServiceEntity,
      BusinessProcessEntity,
      IsrVendorsEntity,
    ]),
    AuthorizationModule,
    BpmModule,
    CategoriesModule,
    HttpModule,
    ServicePricingModule,
  ],
  exports: [VendorRegistrationsService, FileService],
  providers: [
    ServicePricingService,
    HandlingCommonService,
    BankAccountDetailService,
    ShareholderService,
    FileService,
    BeneficialOwnershipService,
    AreasOfBusinessInterestService,
    WorkflowInstanceService,
    ApplicationExcutionService,
    VendorRegistrationsService,
    BusinessAreaService,
    InvoiceService,

    // TusService,
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
