import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, ApiKeyGuard, ExtraCrudOptions } from 'megp-shared-be';
import { ExtraCrudController } from 'megp-shared-be';
import { Step } from 'src/entities/step.entity';
import { StepService } from '../services/step.service';
import { CurrentUser } from 'megp-shared-be';

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
    return await this.stepService.orderStep(activityId, user.organization.id);
  }

  @AllowAnonymous()
  // @UseGuards(ApiKeyGuard)
  @Get('get-by-activity-name/:activityName/:organizationId')
  async getStepByActivityName(
    @Param('activityName') activityName: string,
    @Param('organizationId') organizationId: string,
  ): Promise<any> {
    return await this.stepService.getStepByActivityName(
      activityName,
      organizationId,
    );
  }
}
