import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnualProcurementPlanService } from '../services/annual-procurement-plan.service';
import {
  CreateAnnualProcurementPlanDto,
  UpdateAnnualProcurementPlanDto,
} from '../dto/annual-procurement-Plan.dto';
import { AnnualProcurementPlan } from 'src/entities';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';

const options: EntityCrudOptions = {
  createDto: CreateAnnualProcurementPlanDto,
  updateDto: UpdateAnnualProcurementPlanDto,
};

@Controller('annual-procurement-plans')
@ApiTags('annual-procurement-plans')
export class AnnualProcurementPlanController extends EntityCrudController<AnnualProcurementPlan>(
  options,
) {
  constructor(
    private readonly procurementRequisitionService: AnnualProcurementPlanService,
  ) {
    super(procurementRequisitionService);
  }
}
