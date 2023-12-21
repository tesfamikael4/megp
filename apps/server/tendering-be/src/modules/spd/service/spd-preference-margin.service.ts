import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdPreferenceMargin } from 'src/entities/spd-preference-margin.entity';

@Injectable()
export class SpdPreferenceMarginService extends EntityCrudService<SpdPreferenceMargin> {
  constructor(
    @InjectRepository(SpdPreferenceMargin)
    private readonly spdPreferenceMarginsRepository: Repository<SpdPreferenceMargin>,
  ) {
    super(spdPreferenceMarginsRepository);
  }
}
