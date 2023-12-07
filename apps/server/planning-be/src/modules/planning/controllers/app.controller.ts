import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { APP } from 'src/entities';
import { APPService } from '../services/app.service';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { CreateAPPDto, UpdateAPPDto } from '../dtos/app.dto';

const options: EntityCrudOptions = {
  createDto: CreateAPPDto,
  updateDto: UpdateAPPDto,
};

@Controller('apps')
@ApiTags('apps')
export class APPController extends EntityCrudController<APP>(options) {
  constructor(private readonly appService: APPService) {
    super(appService);
  }

  @Post('auto-create')
  @ApiTags('apps')
  async autoCreate(@Body() create: any): Promise<APP> {
    return await this.appService.autoCreate(create);
  }
}
