import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Step } from 'src/entities/step.entity';
import { StepService } from '../services/step.service';

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
  async bulkCreate(@Body() steps: Step[]): Promise<Step[]> {
    return this.stepService.bulkCreate(steps);
  }

  @Get('order-steps/:activityId')
  async orderStep(@Param('activityId') activityId: string): Promise<any> {
    return this.stepService.orderStep(activityId);
  }
}
