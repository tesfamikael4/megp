import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlanDisbursement } from 'src/entities';
import { PreBudgetPlanDisbursementService } from '../services/pre-budget-plan-disbursement.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-budge-plant-disbursements')
@ApiTags('pre-budge-plant-disbursements')
export class PreBudgetPlanDisbursementController extends ExtraCrudController<PreBudgetPlanDisbursement>(
  options,
) {
  constructor(
    private readonly preBudgetPlanDisbursementService: PreBudgetPlanDisbursementService,
  ) {
    super(preBudgetPlanDisbursementService);
  }
}
