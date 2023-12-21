import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateSpdBdsDto, UpdateSpdBdsDto } from '../dto/spd-bds.dto';
import { SpdBds } from 'src/entities';
import { SpdBdsService } from '../service/spd-bds.service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdBdsDto,
  updateDto: UpdateSpdBdsDto,
};
@ApiBearerAuth()
@Controller('spd-bds')
@ApiTags('Spd-Bds Controller')
export class SpdBdsController extends EntityCrudController<SpdBds>(options) {
  constructor(private readonly spdBdsService: SpdBdsService) {
    super(spdBdsService);
  }
}
