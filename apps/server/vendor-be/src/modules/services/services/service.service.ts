import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BpServiceEntity } from '../../../entities/bp-service.entity';
import { In, Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { ServiceKeyEnum } from 'src/modules/handling/dto/workflow-instance.enum';
@Injectable()
export class BpServiceService extends EntityCrudService<BpServiceEntity> {
  constructor(
    @InjectRepository(BpServiceEntity)
    private readonly serviceRepository: Repository<BpServiceEntity>,
  ) {
    super(serviceRepository);
  }
  async getPreferentialTreatmentServices(): Promise<BpServiceEntity[]> {
    return await this.serviceRepository.find(
      {
        select: { id: true, name: true },
        where: { key: In([ServiceKeyEnum.IBM, ServiceKeyEnum.MSME]) }
      })
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
