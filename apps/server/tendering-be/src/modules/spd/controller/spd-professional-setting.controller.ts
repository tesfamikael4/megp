import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdProfessionalSetting } from 'src/entities';
import { SpdProfessionalSettingService } from '../service/spd-professional-setting.service';
import {
  CreateSpdProfessionalSettingDto,
  UpdateSpdProfessionalSettingDto,
} from '../dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdProfessionalSettingDto,
  updateDto: UpdateSpdProfessionalSettingDto,
};
@ApiBearerAuth()
@Controller('spd-professional-settings')
@ApiTags('Spd Professional Settings')
export class SpdProfessionalSettingController extends EntityCrudController<SpdProfessionalSetting>(
  options,
) {
  constructor(
    private readonly spdProfessionalSettingService: SpdProfessionalSettingService,
  ) {
    super(spdProfessionalSettingService);
  }
}
