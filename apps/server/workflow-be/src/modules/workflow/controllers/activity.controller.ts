import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'src/shared/types/crud-option.type';
import {
  EntityCrudController,
  ExtraCrudController,
} from 'src/shared/controller';
import { Step } from 'src/entities/step.entity';
import { StepService } from '../services/step.service';
import { Activity } from 'src/entities/activity.entity';
import { ActivityService } from '../services/activity.service';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { IgnoreTenantInterceptor } from 'src/shared/decorators';

const options: EntityCrudOptions = {};

@Controller('activities')
@ApiTags('activities')
export class ActivityController extends EntityCrudController<Activity>(
  options,
) {
  constructor(private readonly activityService: ActivityService) {
    super(activityService);
  }
  @Get()
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @IgnoreTenantInterceptor()
  async findAll(@Query('q') q?: string, @Req() req?: any) {
    const query = decodeCollectionQuery(q);
    return this.activityService.findAll(query);
  }

  @Get(':id')
  @IgnoreTenantInterceptor()
  async findOne(@Param('id') id: string, @Req() req?: any) {
    return this.activityService.findOne(id);
  }
}
