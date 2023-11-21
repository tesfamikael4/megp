import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ServicePrice } from '../../../entities/service-price.entity';
import { EntityCrudService } from 'src/shared/service';
import { ServiceKeyEnum } from 'src/modules/handling/dto/workflow-instance.enum';

@Injectable()
export class ServicePricingService extends EntityCrudService<ServicePrice> {
  constructor(
    @InjectRepository(ServicePrice)
    private readonly pricingRepository: Repository<ServicePrice>,
  ) {
    super(pricingRepository);
  }

  async findServicePriceByServiceType(serviceKey: string) {
    let keys = [];
    if (serviceKey === ServiceKeyEnum.new) {
      keys = [
        ServiceKeyEnum.goodsNewRegistration,
        ServiceKeyEnum.servicesNewRegistration,
        ServiceKeyEnum.worksNewRegistration,
      ];
    } else if (serviceKey == ServiceKeyEnum.upgrade) {
      keys = [
        ServiceKeyEnum.goodsUpgrade,
        ServiceKeyEnum.servicesUpgrade,
        ServiceKeyEnum.worksUpgrade,
      ];
    } else if (serviceKey === ServiceKeyEnum.renewal) {
      keys = [
        ServiceKeyEnum.goodsRenewal,
        ServiceKeyEnum.servicesRenewal,
        ServiceKeyEnum.worksRenewal,
      ];
    }
    return await this.pricingRepository.find({
      select: {
        id: true,
        serviceId: true,
        businessArea: true,
        valueFrom: true,
        valueTo: true,
        fee: true,
        currency: true,
        service: { businessProcesses: { id: true }, id: true, key: true },
      },
      relations: { service: { businessProcesses: true } },
      where: {
        service: { businessProcesses: { isActive: true }, key: In(keys) },
      },
    });
  }
  async findPricingWithServiceById(id: string) {
    return this.pricingRepository.findOne({
      relations: { service: true },
      where: { id: id },
    });
  }
}
