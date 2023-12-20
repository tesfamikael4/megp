import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdBdsEntity } from 'src/entities';

@Injectable()
export class SpdBdsService extends EntityCrudService<SpdBdsEntity> {
  constructor(
    @InjectRepository(SpdBdsEntity)
    private readonly spdBdsRepository: Repository<SpdBdsEntity>,
  ) {
    super(spdBdsRepository);
  }
}
