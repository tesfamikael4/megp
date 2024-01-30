import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AnnualProcurementPlan } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';

@Injectable()
export class AnnualProcurementPlanService extends EntityCrudService<AnnualProcurementPlan> {
  constructor(
    @InjectRepository(AnnualProcurementPlan)
    repositoryAnnualProcurementPlan: Repository<AnnualProcurementPlan>,
  ) {
    super(repositoryAnnualProcurementPlan);
  }
}
