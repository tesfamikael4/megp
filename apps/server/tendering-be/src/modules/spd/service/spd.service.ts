import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdEntity } from 'src/entities/spd.entity';

@Injectable()
export class SpdService extends EntityCrudService<SpdEntity> {
  constructor(
    @InjectRepository(SpdEntity)
    private readonly spdRepository: Repository<SpdEntity>,
  ) {
    super(spdRepository);
  }
}
