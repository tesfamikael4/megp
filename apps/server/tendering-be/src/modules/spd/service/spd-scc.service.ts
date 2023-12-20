import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdSccEntity } from 'src/entities';

@Injectable()
export class SpdSccService extends EntityCrudService<SpdSccEntity> {
  constructor(
    @InjectRepository(SpdSccEntity)
    private readonly spdSccRepository: Repository<SpdSccEntity>,
  ) {
    super(spdSccRepository);
  }
}
