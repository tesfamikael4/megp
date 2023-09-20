import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorRegistrationsController } from './vendor-registration.controller';
import { VendorRegistrationsService } from './vendor-registration.service';

import { ServicesEntity } from './entities/services.entity';
import { ServicePriceEntity } from './entities/service-price.entity';
import { ApplicationEntity } from './entities/application.entity';
import { MessageThreadEntity } from './entities/message-thread.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { CustomCategoryEntity } from './entities/custom-category.entity';
import { ServicePricingService } from './service-pricing.service';
import { ServicePricingController } from './service-pricing.controller';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicePriceEntity,
      ApplicationEntity,
      MessageThreadEntity,
      InvoiceEntity,
      BusinessCategoryEntity,
      CustomCategoryEntity,
      ServicesEntity,
      VendorsEntity,
      BanksEntity,
      VendorsBankEntity,
      ShareholdersEntity,
      FilesEntity,
      BankAccountDetailEntity,
      TradeRegistrationDatabaseEntity,
      TinRegistrationDatabaseEntity,
      NCICEntity,
    ]),
  ],
  providers: [
    VendorRegistrationsService,
    ServicePricingService,
    VendorBasicsService,
    BankAccountDetailService,
    ShareholderService,

    TradeRegistrationDatabaseService,
    TinRegistrationDatabaseService,
    NCICService,
  ],
  controllers: [
    VendorRegistrationsController,
    ServicePricingController,
    VendorBasicsController,
    BankAccountDetailController,
    ShareholderController,
    TradeRegistrationDatabaseController,
    TinRegistrationDatabaseController,
    NCICController,
  ],
})
export class VendorRegistrationModule { }
