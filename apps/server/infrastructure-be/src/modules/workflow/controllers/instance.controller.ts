import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Scope,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { InstanceService } from '../services/instance.service';
import { Instance } from '../../../entities/instance.entity';
import { AllowAnonymous, EntityCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions, ExtraCrudOptions } from 'megp-shared-be';
import { StateService } from '../services/state.service';
import { CurrentUser } from 'megp-shared-be';
import { RabbitSubscribe, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

const options: EntityCrudOptions = {};

@Injectable({ scope: Scope.DEFAULT })
@Controller('instance')
@ApiTags('instance')
export class InstanceController extends EntityCrudController<Instance>(
  options,
) {
  constructor(private readonly instanceService: InstanceService) {
    super(instanceService);
  }
  @Inject()
  private readonly instanceServices: InstanceService;

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user) {
    const organizationId = user.organization.id;
    return this.instanceService.findOne(id, organizationId);
  }

  @Get('findCurrentInstanceByItemId/:key/:itemId')
  async findCurrentInstanceByItemId(
    @Param('key') key: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user,
  ) {
    const organizationId = user.organization.id;
    return this.instanceService.findCurrentInstanceByItemId(
      key,
      itemId,
      organizationId,
    );
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

  // @AllowAnonymous()
  // @RabbitRPC({
  //   exchange: 'workflow-broadcast-exchanges',
  //   routingKey: 'workflow.initiate',
  //   queue: 'workflow',
  // })
  async initiate(data: any, context: ConsumeMessage) {
    return await this.instanceServices.initiate(data, context);
  }

  @Post('goto')
  async goto(@Body() data: any, @CurrentUser() user) {
    const organizationId = user.organization.id;
    return this.instanceService.goto(data, organizationId);
  }

  @Get('canSubmit/:key')
  async canSubmit(@Param('key') key: string, @CurrentUser() user) {
    return this.instanceService.canSubmit(key, user.organization.id);
  }
}
