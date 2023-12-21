import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdScc } from 'src/entities';

@Injectable()
export class SpdSccService extends EntityCrudService<SpdScc> {
  constructor(
    @InjectRepository(SpdScc)
    private readonly spdSccRepository: Repository<SpdScc>,
  ) {
    super(spdSccRepository);
  }
}
