import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntityCrudService } from 'src/shared/service';
import { SpdProfessionalSetting } from 'src/entities';

@Injectable()
export class SpdProfessionalSettingService extends EntityCrudService<SpdProfessionalSetting> {
  constructor(
    @InjectRepository(SpdProfessionalSetting)
    private readonly spdProfessionalSettingRepository: Repository<SpdProfessionalSetting>,
  ) {
    super(spdProfessionalSettingRepository);
  }
}
