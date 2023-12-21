import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateSpdSettingsDto,
  UpdateSpdSettingsDto,
} from '../dto/spd-settings.dto';
import { SpdSettings } from 'src/entities/spd-settings.entity';
import { SpdSettingsService } from '../service/spd-settings.service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdSettingsDto,
  updateDto: UpdateSpdSettingsDto,
};
@ApiBearerAuth()
@Controller('spd-settings')
@ApiTags('Spd-Settings')
export class SpdSettingsController extends EntityCrudController<SpdSettings>(
  options,
) {
  constructor(private readonly spdSettingsService: SpdSettingsService) {
    super(spdSettingsService);
  }
}
