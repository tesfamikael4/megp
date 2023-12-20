import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdService } from '../service/spd.service';
import { SpdEntity } from 'src/entities/spd.entity';
import { CreateSpdDto, UpdateSpdDto } from '../dto/spd.dto';
const options: EntityCrudOptions = {
  createDto: CreateSpdDto,
  updateDto: UpdateSpdDto,
};
@ApiBearerAuth()
@Controller('spd')
@ApiTags('Spd Controller')
export class SpdController extends EntityCrudController<SpdEntity>(options) {
  constructor(private readonly spdService: SpdService) {
    super(spdService);
  }
}
