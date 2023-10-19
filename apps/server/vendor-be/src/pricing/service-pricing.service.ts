import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServicePrice } from './entities/service-price';
import { EntityCrudService } from 'src/shared/service';
@Injectable()
export class ServicePricingService extends EntityCrudService<ServicePrice> {
  constructor(
    @InjectRepository(ServicePrice)
    private readonly pricingRepository: Repository<ServicePrice>,
  ) {
    super(pricingRepository);
  }
}
