import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'megp-shared-be';
import { ExtraCrudController } from 'megp-shared-be';
import { CurrentUser } from 'megp-shared-be';
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

  @Get('order-steps/:key/:itemId')
  async orderStep(
    @Param('itemId') itemId: string,
    @Param('key') key: string,
    @CurrentUser() user,
  ): Promise<any> {
    return this.instanceStepService.orderStep(
      itemId,
      key,
      user.organization.id,
    );
  }
}
