import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Step } from 'src/entities/step.entity';
import { StepService } from '../services/step.service';
import { CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'activityId',
};

@Controller('steps')
@ApiTags('steps')
export class StepController extends ExtraCrudController<Step>(options) {
  constructor(private readonly stepService: StepService) {
    super(stepService);
  }

  @Post('bulk-create')
  async bulkCreate(@Body() steps: Step[], @Req() req: any): Promise<Step[]> {
    return this.stepService.bulkCreate(steps, req);
  }

  @Get('order-steps/:activityId')
  async orderStep(
    @Param('activityId') activityId: string,
    @CurrentUser() user,
  ): Promise<any> {
    return this.stepService.orderStep(activityId, user.organization.id);
  }
}
