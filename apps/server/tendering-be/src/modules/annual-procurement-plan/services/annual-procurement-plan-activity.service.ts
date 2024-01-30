import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { AnnualProcurementPlanActivity } from 'src/entities';

@Injectable()
export class AnnualProcurementPlanActivityService extends ExtraCrudService<AnnualProcurementPlanActivity> {
  constructor(
    @InjectRepository(AnnualProcurementPlanActivity)
    private readonly repositoryAnnualProcurementPlanActivity: Repository<AnnualProcurementPlanActivity>,
  ) {
    super(repositoryAnnualProcurementPlanActivity);
  }
}
