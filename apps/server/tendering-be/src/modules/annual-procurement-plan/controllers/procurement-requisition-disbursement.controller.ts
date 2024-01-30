import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnualProcurementPlanDisbursement } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateAnnualProcurementPlanDisbursementDto,
  UpdateAnnualProcurementPlanDisbursementDto,
} from '../dto/annual-procurement-plan-disbursement.dto';
import { AnnualProcurementPlanDisbursementService } from '../services/annual-procurement-plan-disbursement.service';

const options: ExtraCrudOptions = {
  entityIdName: 'annualProcurementPlanActivityId',
  createDto: CreateAnnualProcurementPlanDisbursementDto,
  updateDto: UpdateAnnualProcurementPlanDisbursementDto,
};

@Controller('annual-procurement-plan-disbursements')
@ApiTags('annual-procurement-plan-disbursements')
export class AnnualProcurementPlanDisbursementController extends ExtraCrudController<AnnualProcurementPlanDisbursement>(
  options,
) {
  constructor(
    private readonly annualProcurementPlanDisbursementService: AnnualProcurementPlanDisbursementService,
  ) {
    super(annualProcurementPlanDisbursementService);
  }
}
