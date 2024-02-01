import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnualProcurementPlanTimeline } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateAnnualProcurementPlanTimelineDto,
  UpdateAnnualProcurementPlanTimelineDto,
} from '../dto/annual-procurement-plan-timeline.dto';
import { AnnualProcurementPlanTimelineService } from '../services/annual-procurement-plan-timeline.service';

const options: ExtraCrudOptions = {
  entityIdName: 'annualProcurementPlanActivityId',
  createDto: CreateAnnualProcurementPlanTimelineDto,
  updateDto: UpdateAnnualProcurementPlanTimelineDto,
};

@Controller('annual-procurement-plan-timelines')
@ApiTags('annual-procurement-plan-timelines')
export class AnnualProcurementPlanTimelineController extends ExtraCrudController<AnnualProcurementPlanTimeline>(
  options,
) {
  constructor(
    private readonly annualProcurementPlanTimelineService: AnnualProcurementPlanTimelineService,
  ) {
    super(annualProcurementPlanTimelineService);
  }
}
