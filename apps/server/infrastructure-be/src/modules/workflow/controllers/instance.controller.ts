import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { InstanceService } from '../services/instance.service';
import { Instance } from '../../../entities/instance.entity';
import { EntityCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions, ExtraCrudOptions } from 'megp-shared-be';
import { StateService } from '../services/state.service';
import { CurrentUser } from 'megp-shared-be';

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

  @Get('findCurrentInstance/:id')
  async findCurrentInstance(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user,
  ) {
    const organizationId = user.organization.id;
    return this.instanceService.findCurrentInstance(id, organizationId, itemId);
  }

  @Get('isActive/:key/:itemId')
  async isActive(
    @Param('key') key: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user,
  ) {
    const organizationId = user.organization.id;
    return this.instanceService.isActive(key, organizationId, itemId);
  }

  @Post('initiate')
  @EventPattern('initiate-workflow')
  async initiate(@Body() data: any, @Ctx() context: RmqContext) {
    return await this.instanceService.initiate(data);
  }

  @Post('goto')
  async goto(@Body() data: any, @CurrentUser() user) {
    const organizationId = user.organization.id;
    return this.instanceService.goto(data, organizationId);
  }
}
