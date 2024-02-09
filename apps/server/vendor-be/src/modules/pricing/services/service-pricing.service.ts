import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { ServicePrice } from '../../../entities/service-price.entity';
import { EntityCrudService } from 'src/shared/service';

import { BusinessAreaEntity } from 'src/entities';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';

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
    const result = await this.pricingRepository.find({
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
    return result;
  }

  async findPriceRangeByIds(ids: string[]): Promise<ServicePrice[]> {
    return await this.pricingRepository.find({
      select: {
        id: true,
        valueFrom: true,
        valueTo: true,
        currency: true,
      },
      where: {
        id: In(ids),
      },
    });
  }
  async findPricingWithServiceById(id: string) {
    return this.pricingRepository.findOne({
      relations: { service: true },
      where: { id: id },
    });
  }
  async saveBulk(prices: any[]) {
    try {
      await this.pricingRepository.save(prices);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findserviceByRangeAndKey(
    key: string,
    rangeFrom: number,
    rangeTo: number,
    businessArea: string,
  ) {
    return this.pricingRepository.find({
      relations: { service: true },
      where: {
        service: { key: key },
        businessArea: ILike(businessArea),
        valueFrom: rangeFrom,
        valueTo: rangeTo,
      },
    });
  }
  async getRenewalPrice(businessArea: BusinessAreaEntity, oprationType: string) {
    return this.pricingRepository.findOne({
      relations: { service: true },
      where:
      {
        businessArea: ILike(businessArea.category),
        valueFrom: businessArea.servicePrice.valueFrom,
        valueTo: businessArea.servicePrice.valueTo,
        service: { key: oprationType }

      },

    })
  }

}
