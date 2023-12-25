import { Body, Controller, Post } from '@nestjs/common';
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
  @EventPattern('initiate-workflow')
  async initiate(@Body() data: any, @Ctx() context: RmqContext) {
    return this.instanceService.initiate(data.activityId);
  }

  @Post('goto')
  async goto(@Body() data: any) {
    return this.instanceService.goto(data.activityId, data.details, data.goto);
  }

  @Post('approve-workflow')
  async approveWorkflow() {
    await this.instanceService.approveWorkflow();
  }
}
