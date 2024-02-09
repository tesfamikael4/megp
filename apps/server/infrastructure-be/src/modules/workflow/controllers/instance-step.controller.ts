import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { CurrentUser } from 'src/shared/authorization';
import { InstanceStep } from 'src/entities/instance-step.entity';
import { InstanceStepService } from '../services/instance-step.service';

const options: ExtraCrudOptions = {
  entityIdName: 'activityId',
};

@Controller('instance-steps')
@ApiTags('instance-steps')
export class InstanceStepController extends ExtraCrudController<InstanceStep>(
  options,
) {
  constructor(private readonly instanceStepService: InstanceStepService) {
    super(instanceStepService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() steps: InstanceStep[],
    @Req() req: any,
  ): Promise<InstanceStep[]> {
    return this.instanceStepService.bulkCreate(steps, req);
  }

  @Get('order-steps/:activityId')
  async orderStep(
    @Param('activityId') activityId: string,
    @CurrentUser() user,
  ): Promise<any> {
    return this.instanceStepService.orderStep(activityId, user.organization.id);
  }
}
