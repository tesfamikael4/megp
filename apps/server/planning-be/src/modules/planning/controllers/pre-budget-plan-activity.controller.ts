import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlanActivity } from 'src/entities';
import { PreBudgetPlanActivityService } from '../services/pre-budget-plan-activity.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import {
  CreatePreBudgetPlanActivityDto,
  UpdatePreBudgetPlanActivityDto,
} from '../dtos/pre-budget-plan-activity.dto';
import { OnEvent } from '@nestjs/event-emitter';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanId',
  createDto: CreatePreBudgetPlanActivityDto,
  updateDto: UpdatePreBudgetPlanActivityDto,
};

@Controller('pre-budget-plan-activities')
@ApiTags('pre-budget-plan-activities')
export class PreBudgetPlanActivityController extends ExtraCrudController<PreBudgetPlanActivity>(
  options,
) {
  constructor(
    private readonly preBudgetPlanActivityService: PreBudgetPlanActivityService,
  ) {
    super(preBudgetPlanActivityService);
  }
  @OnEvent('pre.recalculate')
  async recalculate(plan) {
    return await this.preBudgetPlanActivityService.recalculateTotalEstimatedAmount(
      plan,
    );
  }
}
