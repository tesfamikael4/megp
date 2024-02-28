import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementRequisitionTimeline } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementRequisitionTimelineService extends ExtraCrudService<ProcurementRequisitionTimeline> {
  constructor(
    @InjectRepository(ProcurementRequisitionTimeline)
    repositoryProcurementRequisitionTimeline: Repository<ProcurementRequisitionTimeline>,
  ) {
    super(repositoryProcurementRequisitionTimeline);
  }
}
