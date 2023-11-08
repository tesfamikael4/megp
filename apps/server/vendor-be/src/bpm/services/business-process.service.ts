import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessProcessEntity } from '../entities/business-process';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class BusinessProcessService extends EntityCrudService<BusinessProcessEntity> {
  constructor(
    @InjectRepository(BusinessProcessEntity)
    private readonly bpRepository: Repository<BusinessProcessEntity>,
  ) {
    super(bpRepository);
  }
  async findBpService(pricingId: string) {
    console.log('pricingId', pricingId);
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
}
