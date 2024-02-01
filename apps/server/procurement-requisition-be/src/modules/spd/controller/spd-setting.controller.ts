import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateSpdSettingsDto,
  UpdateSpdSettingsDto,
} from '../dto/spd-setting.dto';
import { SpdSetting } from 'src/entities/spd-setting.entity';
import { SpdSettingService } from '../service/spd-setting.service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdSettingsDto,
  updateDto: UpdateSpdSettingsDto,
};
@ApiBearerAuth()
@Controller('spd-settings')
@ApiTags('Spd-Settings')
export class SpdSettingsController extends EntityCrudController<SpdSetting>(
  options,
) {
  constructor(private readonly spdSettingsService: SpdSettingService) {
    super(spdSettingsService);
  }
}
