import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { BusinessProcessEntity } from 'src/entities/business-process.entity';

@Injectable()
export class BusinessProcessService extends EntityCrudService<BusinessProcessEntity> {
  constructor(
    @InjectRepository(BusinessProcessEntity)
    private readonly bpRepository: Repository<BusinessProcessEntity>,
  ) {
    super(bpRepository);
  }
  async findBpService(pricingId: string) {
    return await this.bpRepository.findOne({
      select: { serviceId: true, id: true },
      relations: { service: { prices: true } },
      where: {
        isActive: true,
        service: { prices: { id: pricingId } },
      },
    });
  }

  async findWorkflowByServiceAndBP(
    serviceId: string,
    bpId: string,
  ): Promise<BusinessProcessEntity> {
    const result = await this.bpRepository.findOne({
      relations: { service: true },
      where: {
        isActive: true,
        id: bpId,
        service: { id: serviceId },
      },
    });
    return result;
  }
  async findBpWithServiceByKey(key: string): Promise<BusinessProcessEntity> {
    const result = await this.bpRepository.findOne({
      relations: { service: true },
      where: {
        isActive: true,
        service: { key: key },
      },
    });
    return result;
  }
  async findBpWithServiceByServiceId(
    serviceId: string,
  ): Promise<BusinessProcessEntity> {
    const result = await this.bpRepository.findOne({
      relations: { service: true },
      where: {
        isActive: true,
        service: { id: serviceId },
      },
    });
    return result;
  }
  async findBpWithServiceByServiceIds(
    serviceIds: string[],
  ): Promise<BusinessProcessEntity[]> {
    const result = await this.bpRepository.find({
      relations: { service: true },
      where: {
        isActive: true,
        service: { id: In(serviceIds) },
      },
    });
    return result;
  }
  async saveBulk(bps: any[]) {
    try {
      await this.bpRepository.save(bps);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
