import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlanDisbursement } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PreBudgetPlanDisbursementService extends ExtraCrudService<PreBudgetPlanDisbursement> {
  constructor(
    @InjectRepository(PreBudgetPlanDisbursement)
    private readonly repositoryPreBudgetPlanDisbursement: Repository<PreBudgetPlanDisbursement>,
  ) {
    super(repositoryPreBudgetPlanDisbursement);
  }
}
