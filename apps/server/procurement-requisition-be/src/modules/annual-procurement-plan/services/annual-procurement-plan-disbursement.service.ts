import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnualProcurementPlanDisbursement } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class AnnualProcurementPlanDisbursementService extends ExtraCrudService<AnnualProcurementPlanDisbursement> {
  constructor(
    @InjectRepository(AnnualProcurementPlanDisbursement)
    private readonly repositoryAnnualProcurementPlanDisbursement: Repository<AnnualProcurementPlanDisbursement>,
  ) {
    super(repositoryAnnualProcurementPlanDisbursement);
  }
}
