import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreBudgePlantDisbursement } from 'src/entities';
import { PreBudgePlantDisbursementService } from '../services/pre-budge-plant-disbursement.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-budge-plant-disbursements')
@ApiTags('pre-budge-plant-disbursements')
export class PreBudgePlantDisbursementController extends ExtraCrudController<PreBudgePlantDisbursement>(
  options,
) {
  constructor(
    private readonly preBudgePlantDisbursementService: PreBudgePlantDisbursementService,
  ) {
    super(preBudgePlantDisbursementService);
  }
}
