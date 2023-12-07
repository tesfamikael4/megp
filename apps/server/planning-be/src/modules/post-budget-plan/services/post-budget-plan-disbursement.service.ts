import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { PostBudgetPlanDisbursement } from 'src/entities';

@Injectable()
export class PostBudgetPlanDisbursementService extends ExtraCrudService<PostBudgetPlanDisbursement> {
  constructor(
    @InjectRepository(PostBudgetPlanDisbursement)
    private readonly repositoryPostBudgetPlanDisbursement: Repository<PostBudgetPlanDisbursement>,
  ) {
    super(repositoryPostBudgetPlanDisbursement);
  }
}
