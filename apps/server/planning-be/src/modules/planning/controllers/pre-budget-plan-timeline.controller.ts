import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlanTimeline } from 'src/entities';
import { PreBudgetPlanTimelineService } from '../services/pre-budget-plan-timeline.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-budget-plan-timelines')
@ApiTags('pre-budget-plan-timelines')
export class PreBudgetPlanTimelineController extends ExtraCrudController<PreBudgetPlanTimeline>(
  options,
) {
  constructor(
    private readonly preBudgetPlanTimelineService: PreBudgetPlanTimelineService,
  ) {
    super(preBudgetPlanTimelineService);
  }
}
