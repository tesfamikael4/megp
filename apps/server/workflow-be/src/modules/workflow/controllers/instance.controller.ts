import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { InstanceService } from '../services/instance.service';
import { Instance } from '../../../entities/instance.entity';
import { EntityCrudController } from 'src/shared/controller';
import { ApiTags } from '@nestjs/swagger';
import {
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'src/shared/types/crud-option.type';
import { StateService } from '../services/state.service';
import { CurrentUser } from 'src/shared/authorization';

const options: EntityCrudOptions = {};

@Controller('instance')
@ApiTags('instance')
export class InstanceController extends EntityCrudController<Instance>(
  options,
) {
  constructor(private readonly instanceService: InstanceService) {
    super(instanceService);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user) {
    const organizationId = user.organization.id;
    return this.instanceService.findOne(id, organizationId);
  }

  @Post('initiate')
  @EventPattern('initiate-workflow')
  async initiate(@Body() data: any, @Ctx() context: RmqContext) {
    return await this.instanceService.initiate(data);
  }

  @Post('goto')
  async goto(@Body() data: any) {
    return this.instanceService.goto(data.activityId, data.details, data.goto);
  }
}
