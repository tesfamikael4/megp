import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { SpdPreferenceMargin } from 'src/entities/spd-preference-margin.entity';

@Injectable()
export class SpdPreferenceMarginService extends ExtraCrudService<SpdPreferenceMargin> {
  constructor(
    @InjectRepository(SpdPreferenceMargin)
    private readonly spdPreferenceMarginsRepository: Repository<SpdPreferenceMargin>,
  ) {
    super(spdPreferenceMarginsRepository);
  }
}
