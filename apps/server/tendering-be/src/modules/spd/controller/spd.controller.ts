import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdService } from '../service/spd.service';
import { Spd } from 'src/entities/spd.entity';
import { CreateSpdDto, UpdateSpdDto } from '../dto/spd.dto';
import { AllowAnonymous } from 'src/shared/authorization';

const options: EntityCrudOptions = {
  createDto: CreateSpdDto,
  updateDto: UpdateSpdDto,
};

@ApiBearerAuth()
@Controller('spd')
@ApiTags('Spd Controller')
@AllowAnonymous()
export class SpdController extends EntityCrudController<Spd>(options) {
  constructor(private readonly spdService: SpdService) {
    super(spdService);
  }
}
