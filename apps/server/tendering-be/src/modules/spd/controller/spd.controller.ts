import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdService } from '../service/spd.service';
import { Spd } from 'src/entities/spd.entity';
import { CreateSpdDto, ToggleIsActiveDto, UpdateSpdDto } from '../dto/spd.dto';
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

  @Post('toggle-is-active')
  @AllowAnonymous()
  async uploadSPDDocument(@Body() payload: ToggleIsActiveDto) {
    return await this.spdService.toggleActiveStatus(payload);
  }
}
