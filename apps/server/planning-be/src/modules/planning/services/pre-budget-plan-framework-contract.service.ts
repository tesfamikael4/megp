import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlanFrameworkContract } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PreBudgetPlanFrameworkContractService extends ExtraCrudService<PreBudgetPlanFrameworkContract> {
  constructor(
    @InjectRepository(PreBudgetPlanFrameworkContract)
    private readonly repositoryPreBudgetPlanFrameworkContract: Repository<PreBudgetPlanFrameworkContract>,
  ) {
    super(repositoryPreBudgetPlanFrameworkContract);
  }
}
