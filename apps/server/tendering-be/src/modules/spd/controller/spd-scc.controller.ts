import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdSccEntity } from 'src/entities';
import { SpdSccService } from '../service/spd-scc.service';
import { CreateSpdSccDto, UpdateSpdSccDto } from '../dto/spd-scc.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdSccDto,
  updateDto: UpdateSpdSccDto,
};
@ApiBearerAuth()
@Controller('spd-scc')
@ApiTags('Spd-Scc Controller')
export class SpdSccController extends EntityCrudController<SpdSccEntity>(
  options,
) {
  constructor(private readonly spdSccService: SpdSccService) {
    super(spdSccService);
  }
}
