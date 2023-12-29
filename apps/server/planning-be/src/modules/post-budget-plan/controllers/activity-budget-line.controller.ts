import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { ActivityBudgetLine } from 'src/entities/activity-budget-line.entity';
import { ActivityBudgetLineService } from '../services/activity-budget-line.service';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('activity-budget-lines')
@ApiTags('activity-coa-tags')
export class ActivityBudgetLineController extends ExtraCrudController<ActivityBudgetLine>(
  options,
) {
  constructor(
    private readonly activityBudgetLineService: ActivityBudgetLineService,
  ) {
    super(activityBudgetLineService);
  }
}
