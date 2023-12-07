import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostBudgetPlanFrameworkContract } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PostBudgetPlanFrameworkContractService extends ExtraCrudService<PostBudgetPlanFrameworkContract> {
  constructor(
    @InjectRepository(PostBudgetPlanFrameworkContract)
    private readonly repositoryPostBudgetPlanFrameworkContract: Repository<PostBudgetPlanFrameworkContract>,
  ) {
    super(repositoryPostBudgetPlanFrameworkContract);
  }
}
