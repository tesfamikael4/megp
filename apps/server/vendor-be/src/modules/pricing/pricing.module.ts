import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePrice } from 'src/entities/service-price.entity';
import { ServicePricingService } from './services/service-pricing.service';
import { ServicePricingController } from './controllers/service-pricing.controller';
import { AuthorizationModule } from 'src/shared/authorization';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePrice]), AuthorizationModule],
  exports: [ServicePricingService],
  providers: [ServicePricingService],
  controllers: [ServicePricingController],
})
export class ServicePricingModule {}
