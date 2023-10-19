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
}
