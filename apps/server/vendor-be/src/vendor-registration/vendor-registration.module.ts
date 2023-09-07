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
    ]),
  ],
  providers: [
    VendorRegistrationsService,
    ServicePricingService,
    VendorBasicsService,
  ],
  controllers: [
    VendorRegistrationsController,
    ServicePricingController,
    VendorBasicsController,
  ],
})
export class VendorRegistrationModule {}
