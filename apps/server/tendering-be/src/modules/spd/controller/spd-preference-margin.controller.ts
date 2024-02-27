import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdPreferenceMargin } from 'src/entities';
import {
  CreateSpdPreferenceMarginDto,
  UpdateSpdPreferenceMarginDto,
} from '../dto';
import { SpdPreferenceMarginService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdPreferenceMarginDto,
  updateDto: UpdateSpdPreferenceMarginDto,
};

@ApiBearerAuth()
@Controller('spd-preference-margins')
@ApiTags('Spd Preference Margins')
export class SpdPreferenceMarginController extends EntityCrudController<SpdPreferenceMargin>(
  options,
) {
  constructor(
    private readonly spdPreferenceMarginService: SpdPreferenceMarginService,
  ) {
    super(spdPreferenceMarginService);
  }
}
