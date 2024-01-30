import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnualProcurementPlanActivity } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateAnnualProcurementPlanActivityDto,
  UpdateAnnualProcurementPlanActivityDto,
} from '../dto/annual-procurement-plan-activity.dto';
import { AnnualProcurementPlanActivityService } from '../services/annual-procurement-plan-activity.service';

const options: ExtraCrudOptions = {
  entityIdName: 'annualProcurementPlanId',
  createDto: CreateAnnualProcurementPlanActivityDto,
  updateDto: UpdateAnnualProcurementPlanActivityDto,
};

@Controller('annual-procurement-plan-activities')
@ApiTags('annual-procurement-plan-activities')
export class AnnualProcurementPlanActivityController extends ExtraCrudController<AnnualProcurementPlanActivity>(
  options,
) {
  constructor(
    private readonly annualProcurementPlanActivityService: AnnualProcurementPlanActivityService,
  ) {
    super(annualProcurementPlanActivityService);
  }
}
