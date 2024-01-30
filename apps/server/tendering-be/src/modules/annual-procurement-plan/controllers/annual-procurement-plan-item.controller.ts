import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnualProcurementPlanItem } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateAnnualProcurementPlanItemDto,
  UpdateAnnualProcurementPlanItemDto,
} from '../dto/annual-procurement-plan-item.dto';
import { AnnualProcurementPlanItemService } from '../services/procurement-requisition-item.service';
const options: ExtraCrudOptions = {
  entityIdName: 'annualProcurementPlanActivityId',
  createDto: CreateAnnualProcurementPlanItemDto,
  updateDto: UpdateAnnualProcurementPlanItemDto,
};

@Controller('annual-procurement-plan-items')
@ApiTags('annual-procurement-plan-items')
export class AnnualProcurementPlanItemController extends ExtraCrudController<AnnualProcurementPlanItem>(
  options,
) {
  constructor(
    private readonly annualProcurementPlanItemService: AnnualProcurementPlanItemService,
  ) {
    super(annualProcurementPlanItemService);
  }
}
