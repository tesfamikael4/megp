import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgetPlanFrameworkContract } from 'src/entities';
import { PreBudgetPlanFrameworkContractService } from '../services/pre-budget-plan-framework-contract.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-budget-plan-framework-contracts')
@ApiTags('pre-budget-plan-framework-contracts')
export class PreBudgetPlanFrameworkContractController extends ExtraCrudController<PreBudgetPlanFrameworkContract>(
  options,
) {
  constructor(
    private readonly preBudgetPlanFrameworkContractService: PreBudgetPlanFrameworkContractService,
  ) {
    super(preBudgetPlanFrameworkContractService);
  }
}
