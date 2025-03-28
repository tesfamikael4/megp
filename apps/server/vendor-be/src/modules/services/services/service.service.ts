import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BpServiceEntity } from '../../../entities/bp-service.entity';
import { In, Not, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { ServiceKeyEnum } from 'src/shared/enums/service-key.enum';

@Injectable()
export class BpServiceService extends EntityCrudService<BpServiceEntity> {
  constructor(
    @InjectRepository(BpServiceEntity)
    private readonly serviceRepository: Repository<BpServiceEntity>,
  ) {
    super(serviceRepository);
  }
  async getPreferentialTreatmentServices(): Promise<BpServiceEntity[]> {
    return await this.serviceRepository.find({
      select: { id: true, name: true },
      where: {
        key: In([
          ServiceKeyEnum.IBM,
          ServiceKeyEnum.MICRO,
          ServiceKeyEnum.SMALL,
          ServiceKeyEnum.MEDIUM,
          ServiceKeyEnum.MARGINALIZED_GROUP,
        ]),
      },
    });
  }
  async getPreferentialTreatmentByKeys(
    keys: string[],
  ): Promise<BpServiceEntity[]> {
    return await this.serviceRepository.find({
      select: { id: true, name: true },
      where: {
        id: Not(In(keys)),
      },
    });
  }

  async saveBulk(services: any[]) {
    try {
      await this.serviceRepository.save(services);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
