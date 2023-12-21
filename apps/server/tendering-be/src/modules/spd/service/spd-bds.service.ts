import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdBds } from 'src/entities';

@Injectable()
export class SpdBdsService extends EntityCrudService<SpdBds> {
  constructor(
    @InjectRepository(SpdBds)
    private readonly spdBdsRepository: Repository<SpdBds>,
  ) {
    super(spdBdsRepository);
  }
}
