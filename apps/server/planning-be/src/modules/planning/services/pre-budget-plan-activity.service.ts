import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlan, PreBudgetPlanActivity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PreBudgetPlanActivityService extends ExtraCrudService<PreBudgetPlanActivity> {
  constructor(
    @InjectRepository(PreBudgetPlanActivity)
    private readonly repositoryPreBudgetPlanActivity: Repository<PreBudgetPlanActivity>,
    @InjectRepository(PreBudgetPlan)
    private readonly repositoryPreBudgetPlan: Repository<PreBudgetPlan>,
  ) {
    super(repositoryPreBudgetPlanActivity);
  }

  async create(itemData: any): Promise<any> {
    const item = await this.repositoryPreBudgetPlanActivity.create(itemData);
    const plan = await this.repositoryPreBudgetPlan.findOne({
      where: {
        id: itemData.preBudgetPlanId,
      },
    });
    const curr = itemData.currency;
    plan.estimatedAmount.curr = itemData.estimatedAmount;
    await this.repositoryPreBudgetPlanActivity.insert(item);
    await this.repositoryPreBudgetPlan.save(plan);

    return item;
  }
}
