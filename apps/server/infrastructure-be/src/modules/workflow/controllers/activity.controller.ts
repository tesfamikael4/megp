import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CollectionQuery,
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { EntityCrudController, ExtraCrudController } from 'megp-shared-be';
import { Step } from 'src/entities/step.entity';
import { StepService } from '../services/step.service';
import { Activity } from 'src/entities/activity.entity';
import { ActivityService } from '../services/activity.service';
import { decodeCollectionQuery } from 'megp-shared-be';
import { IgnoreTenantInterceptor } from 'megp-shared-be';

const options: ExtraCrudOptions = {
  entityIdName: 'workflowId',
};

@Controller('activities')
@ApiTags('activities')
export class ActivityController extends ExtraCrudController<Activity>(options) {
  constructor(private readonly activityService: ActivityService) {
    super(activityService);
  }
  @Get('find-all')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @IgnoreTenantInterceptor()
  async findAllActivities(
    // @Param('id') id: string,
    @Query('q') q: string,
    @Req() req?: any,
  ) {
    const query = decodeCollectionQuery(q);
    return this.activityService.findAllActivities(query, options, req);
  }

  @Get(':name')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @IgnoreTenantInterceptor()
  async findByName(
    @Param('name') name: string,
    @Query('q') q: string,
    @Req() req?: any,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.activityService.findByName(name, query, options, req);
  }
  @Get(':id')
  @IgnoreTenantInterceptor()
  async findOne(@Param('id') id: string, @Req() req?: any) {
    return this.activityService.findOne(id);
  }

  @Get('find-by-key/:name')
  @IgnoreTenantInterceptor()
  async findOneByKey(@Param('name') name: string, @Req() req?: any) {
    return this.activityService.findOne(name);
  }
}
