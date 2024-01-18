import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanTimeline } from 'src/entities';
import { PostBudgetPlanTimelineService } from '../services/post-budget-plan-timeline.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { BulkTimelineDto } from '../dtos/post-budget-plan-timeline.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('post-budget-plan-timelines')
@ApiTags('post-budget-plan-timelines')
export class PostBudgetPlanTimelineController extends ExtraCrudController<PostBudgetPlanTimeline>(
  options,
) {
  constructor(
    private readonly postBudgetPlanTimelineService: PostBudgetPlanTimelineService,
  ) {
    super(postBudgetPlanTimelineService);
  }
  @Post('bulk-create')
  async bulkCreate(
    @Body() timelines: BulkTimelineDto,
    @Req() req: any,
  ): Promise<BulkTimelineDto> {
    return this.postBudgetPlanTimelineService.bulkCreate(timelines, req);
  }
}
