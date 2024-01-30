import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnualProcurementPlanTimeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class AnnualProcurementPlanTimelineService extends ExtraCrudService<AnnualProcurementPlanTimeline> {
  constructor(
    @InjectRepository(AnnualProcurementPlanTimeline)
    private readonly repositoryAnnualProcurementPlanTimeline: Repository<AnnualProcurementPlanTimeline>,
  ) {
    super(repositoryAnnualProcurementPlanTimeline);
  }
}
