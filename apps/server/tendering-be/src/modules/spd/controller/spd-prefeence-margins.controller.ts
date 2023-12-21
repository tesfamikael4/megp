import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdPrefeenceMargins } from 'src/entities/spd-prefeence-margins.entity';
import { SpdPrefeenceMarginsService } from '../service/spd-prefeence-margins.service';
import {
  CreateSpdPrefeenceMarginsDto,
  UpdateSpdPrefeenceMarginsDto,
} from '../dto/spd-prefeence-margins.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdPrefeenceMarginsDto,
  updateDto: UpdateSpdPrefeenceMarginsDto,
};
@ApiBearerAuth()
@Controller('spd-prefeence-margins')
@ApiTags('Spd-Prefeence-Margins')
export class SpdPrefeenceMarginsController extends EntityCrudController<SpdPrefeenceMargins>(
  options,
) {
  constructor(
    private readonly spdPrefeenceMarginsService: SpdPrefeenceMarginsService,
  ) {
    super(spdPrefeenceMarginsService);
  }
}
