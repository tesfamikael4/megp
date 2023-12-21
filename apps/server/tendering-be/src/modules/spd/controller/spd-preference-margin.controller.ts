import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdPreferenceMargin } from 'src/entities/spd-preference-margin.entity';
import { SpdPreferenceMarginService } from '../service/spd-preference-margin.service';
import {
  CreateSpdPreferenceMarginsDto,
  UpdateSpdPreferenceMarginsDto,
} from '../dto/spd-preference-margin.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdPreferenceMarginsDto,
  updateDto: UpdateSpdPreferenceMarginsDto,
};
@ApiBearerAuth()
@Controller('spd-preference-margins')
@ApiTags('Spd-Preference-Margins')
export class SpdPreferenceMarginController extends EntityCrudController<SpdPreferenceMargin>(
  options,
) {
  constructor(
    private readonly spdPreferenceMarginsService: SpdPreferenceMarginService,
  ) {
    super(spdPreferenceMarginsService);
  }
}
