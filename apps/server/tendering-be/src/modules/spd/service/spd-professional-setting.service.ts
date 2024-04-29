import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { SpdProfessionalSetting } from 'src/entities';

@Injectable()
export class SpdProfessionalSettingService extends ExtraCrudService<SpdProfessionalSetting> {
  constructor(
    @InjectRepository(SpdProfessionalSetting)
    private readonly spdProfessionalSettingRepository: Repository<SpdProfessionalSetting>,
  ) {
    super(spdProfessionalSettingRepository);
  }
}
