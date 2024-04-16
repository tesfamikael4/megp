import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmittedPlanService } from '../services/submitted-plan.service';
import { AllowAnonymous } from 'src/shared/authorization';
import { EntityCrudController } from 'src/shared/controller';
import { SubmittedPlan } from 'src/entities/submitted-plan.entity';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';

const options: EntityCrudOptions = {};

@Controller('submitted-plan')
@ApiTags('submitted-plan')
export class SubmittedPlanController extends EntityCrudController<SubmittedPlan>(
  options,
) {
  constructor(private readonly submittedPlanService: SubmittedPlanService) {
    super(submittedPlanService);
  }

  @AllowAnonymous()
  @Get('get-by-objectId/:objectId')
  async getPlanByObjectId(@Param('objectId') objectId: string) {
    return await this.submittedPlanService.getByObjectId(objectId);
  }

  @AllowAnonymous()
  @Get('prev-versions/:id')
  async getPreviousVersion(@Param('id') id: any) {
    return await this.submittedPlanService.getPreviousVersions(id);
  }

  @AllowAnonymous()
  @Post('compare-json')
  async compareJson(@Body() data: any) {
    return await this.submittedPlanService.deepEqual(data.obj1, data.obj2);
  }
}
