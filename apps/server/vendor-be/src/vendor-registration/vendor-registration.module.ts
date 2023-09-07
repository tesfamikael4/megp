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
    ]),
  ],
  providers: [VendorRegistrationsService, ServicePricingService],
  controllers: [VendorRegistrationsController, ServicePricingController],
})
export class VendorRegistrationModule {}
