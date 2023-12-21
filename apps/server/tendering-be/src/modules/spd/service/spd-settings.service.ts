import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdSettings } from 'src/entities/spd-settings.entity';

@Injectable()
export class SpdSettingsService extends EntityCrudService<SpdSettings> {
  constructor(
    @InjectRepository(SpdSettings)
    private readonly SpdSettingsRepository: Repository<SpdSettings>,
  ) {
    super(SpdSettingsRepository);
  }
}
