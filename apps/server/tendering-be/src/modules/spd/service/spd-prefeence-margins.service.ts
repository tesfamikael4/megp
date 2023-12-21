import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdPrefeenceMargins } from 'src/entities/spd-prefeence-margins.entity';

@Injectable()
export class SpdPrefeenceMarginsService extends EntityCrudService<SpdPrefeenceMargins> {
  constructor(
    @InjectRepository(SpdPrefeenceMargins)
    private readonly spdPrefeenceMarginsRepository: Repository<SpdPrefeenceMargins>,
  ) {
    super(spdPrefeenceMarginsRepository);
  }
}
