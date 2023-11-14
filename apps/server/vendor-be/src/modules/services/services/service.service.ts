import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BpServiceEntity } from '../../../entities/bp-service.entity';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
@Injectable()
export class BpServiceService extends EntityCrudService<BpServiceEntity> {
  constructor(
    @InjectRepository(BpServiceEntity)
    private readonly serviceRepository: Repository<BpServiceEntity>,
  ) {
    super(serviceRepository);
  }
}
