import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdSetting } from 'src/entities/spd-setting.entity';

@Injectable()
export class SpdSettingService extends EntityCrudService<SpdSetting> {
  constructor(
    @InjectRepository(SpdSetting)
    private readonly SpdSettingRepository: Repository<SpdSetting>,
  ) {
    super(SpdSettingRepository);
  }
}
