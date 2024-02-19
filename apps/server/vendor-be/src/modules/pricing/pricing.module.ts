import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePrice } from 'src/entities/service-price.entity';
import { ServicePricingService } from './services/service-pricing.service';
import { ServicePricingController } from './controllers/service-pricing.controller';
import { AuthorizationModule } from 'src/shared/authorization';
import { HandlingCommonService } from '../handling/services/handling-common-services';
import { WorkflowInstanceEntity } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePrice, WorkflowInstanceEntity]), AuthorizationModule],
  exports: [ServicePricingService],
  providers: [ServicePricingService, HandlingCommonService],
  controllers: [ServicePricingController],
})
export class ServicePricingModule { }
