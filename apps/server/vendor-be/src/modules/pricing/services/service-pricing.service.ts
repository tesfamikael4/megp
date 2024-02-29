import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  ILike,
  In,
  Repository,
} from 'typeorm';
import { ServicePrice } from '../../../entities/service-price.entity';
import { EntityCrudService } from 'src/shared/service';

import { BusinessAreaEntity } from 'src/entities';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';
import { HandlingCommonService } from 'src/modules/handling/services/handling-common-services';

@Injectable()
export class ServicePricingService extends EntityCrudService<ServicePrice> {
  constructor(
    @InjectRepository(ServicePrice)
    private readonly pricingRepository: Repository<ServicePrice>,
    private readonly commonService: HandlingCommonService,
  ) {
    super(pricingRepository);
  }

  async findServicePriceByServiceType(serviceKey: string) {
    const keys = this.commonService.getServiceCatagoryKeys(serviceKey);
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
      order: { valueFrom: 'ASC' },
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
  async findPricingWithServiceByIds(ids: string[]) {
    return this.pricingRepository.find({
      relations: { service: true },
      where: { id: In(ids) },
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
  // async findserviceByRangeAndKey(
  //   key: string,
  //   rangeFrom: number,
  //   rangeTo: number,
  //   businessArea: string,
  // ) {
  //   return this.pricingRepository.find({
  //     relations: { service: true },
  //     where: {
  //       service: { key: key },
  //       businessArea: ILike(businessArea),
  //       valueFrom: rangeFrom,
  //       valueTo: rangeTo,
  //     },
  //   });
  // }
  async getRenewalPrice(
    businessArea: BusinessAreaEntity,
    oprationType: string,
  ) {
    return this.pricingRepository.findOne({
      relations: { service: true },
      where: {
        businessArea: ILike(businessArea.category),
        valueFrom: businessArea.servicePrice.valueFrom,
        valueTo: businessArea.servicePrice.valueTo,
        service: { key: oprationType },
      },
    });
  }
}
