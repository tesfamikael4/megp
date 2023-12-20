import { Body, Controller, Post } from '@nestjs/common';
import { InstanceService } from '../services/instance.service';
import { Instance } from '../../../entities/instance.entity';
import { EntityCrudController } from 'src/shared/controller';
import { ApiTags } from '@nestjs/swagger';
import {
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'src/shared/types/crud-option.type';

const options: EntityCrudOptions = {};

@Controller('instance')
@ApiTags('instance')
export class InstanceController extends EntityCrudController<Instance>(
  options,
) {
  constructor(private readonly instanceService: InstanceService) {
    super(instanceService);
  }

  @Post('initiate')
  async initiate(@Body() data: any) {
    return this.instanceService.initiate(data.activityId);
  }
}
