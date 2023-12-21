import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { Spd } from 'src/entities/spd.entity';

@Injectable()
export class SpdService extends EntityCrudService<Spd> {
  constructor(
    @InjectRepository(Spd)
    private readonly spdRepository: Repository<Spd>,
  ) {
    super(spdRepository);
  }
}
