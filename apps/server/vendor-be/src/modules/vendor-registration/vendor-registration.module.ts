import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorRegistrationsController } from './controllers/vendor-registration.controller';
import { VendorRegistrationsService } from './services/vendor-registration.service';

import { AreasOfBusinessInterestController } from './controllers/areas-of-business-interest.controller';
import { AreasOfBusinessInterestService } from './services/areas-of-business-interest.service';
import { UploadController } from './controllers/file.controller';
import { BusinessAreaController } from './controllers/business-area.controller';
import { BusinessAreaService } from './services/business-area.service';
import { AuthorizationModule } from 'src/shared/authorization';
import {
  AreasOfBusinessInterestEntity,
  BankAccountDetailEntity,
  BanksEntity,
  BeneficialOwnershipShares,
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
import { ProfileInfoEntity } from 'src/entities/profile-info.entity';
import { InvoicesController } from './controllers/invoice.controller';
import { ServiceModule } from '../services/service.module';
import { BpServiceService } from '../services/services/service.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { PreferentailTreatmentService } from './services/preferentail-treatment.service';
import { PreferentailTreatmentsController } from './controllers/preferential-treatment.controller';
import { BriefcasesController } from './controllers/briefcases.controller';
import { BriefcasesService } from './services/briefcases.service';
import { BriefecaseEntity } from 'src/entities/brifecase.entity';
import { CertificateModule } from '../certificates/certificate.module';
import { VendorDiscoveryController } from './controllers/vendor-discovery.controller';
import { VendorDiscoveryService } from './services/vendor-discovery.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BankAccountDetailController } from './controllers/bank-account-detail.controller';
import { BankAccountDetailService } from './services/bank-account-detail.service';
import { NotificationModule } from '../notifications/notification.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessCategoryEntity,
      CustomCategoryEntity,
      VendorsEntity,
      BanksEntity,
      BeneficialOwnershipShares,
      FilesEntity,
      BankAccountDetailEntity,
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
      ProfileInfoEntity,
      PreferentialTreatmentsEntity,
      BriefecaseEntity,
    ]),
    EventEmitterModule.forRoot(),
    AuthorizationModule,
    BpmModule,
    CategoriesModule,
    HttpModule,
    ServicePricingModule,
    ServiceModule,
    NotificationModule,
    ClientsModule.register([
      {
        name: 'VENDOR_REGISTRATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'iam',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  exports: [VendorRegistrationsService, FileService, BusinessAreaService],
  providers: [
    ServicePricingService,
    HandlingCommonService,
    FileService,
    AreasOfBusinessInterestService,
    WorkflowInstanceService,
    ApplicationExcutionService,
    VendorRegistrationsService,
    BusinessAreaService,
    InvoiceService,
    BpServiceService,
    PreferentailTreatmentService,
    BriefcasesService,
    VendorDiscoveryService,
    BankAccountDetailService,
    // TusService,
  ],
  controllers: [
    WorkflowInstanceController,
    ApplicationExcutionController,
    VendorRegistrationsController,
    ServicePricingController,
    UploadController,
    AreasOfBusinessInterestController,
    BusinessAreaController,
    InvoicesController,
    PreferentailTreatmentsController,
    BriefcasesController,
    VendorDiscoveryController,
    BankAccountDetailController,
  ],
})
export class VendorRegistrationModule {}
