import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmittedPlanService } from '../services/submitted-plan.service';
import { AllowAnonymous } from 'src/shared/authorization';

@Controller('submitted-plan')
@ApiTags('submitted-plan')
export class SubmittedPlanController {
  constructor(private readonly submittedPlanService: SubmittedPlanService) {}

  @AllowAnonymous()
  @Post('compare-json')
  async compareJson(@Body() data: any) {
    return await this.submittedPlanService.deepEqual(data.obj1, data.obj2);
  }
}
