import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PreBudgetPlan, PreBudgetPlanActivity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PreBudgetPlanActivityService extends ExtraCrudService<PreBudgetPlanActivity> {
  constructor(
    @InjectRepository(PreBudgetPlanActivity)
    private readonly repositoryPreBudgetPlanActivity: Repository<PreBudgetPlanActivity>,
    @InjectRepository(PreBudgetPlan)
    private readonly repositoryPreBudgetPlan: Repository<PreBudgetPlan>,
    private eventEmitter: EventEmitter2,
  ) {
    super(repositoryPreBudgetPlanActivity);
  }

  async create(itemData: any, req: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    const activity =
      await this.repositoryPreBudgetPlanActivity.create(itemData);
    const plan = await this.repositoryPreBudgetPlan.findOne({
      where: {
        id: itemData.preBudgetPlanId,
      },
      relations: ['preBudgetPlanActivities'],
    });
    if (!plan) {
      throw new NotFoundException(`PreBudgetPlan not found`);
    }

    await this.repositoryPreBudgetPlanActivity.insert(activity);
    this.eventEmitter.emit('pre.recalculateEstimatedAmount', {
      preBudgetPlanId: itemData.preBudgetPlanId,
    });

    return activity;
  }
  async recalculateTotalEstimatedAmount(payload): Promise<void> {
    const preBudgetPlan = await this.repositoryPreBudgetPlan.findOne({
      where: {
        id: payload.preBudgetPlanId,
      },
      relations: ['preBudgetPlanActivities'],
    });
    if (!preBudgetPlan) {
      throw new NotFoundException(`PreBudgetPlan not found`);
    }
    const estimatedAmountByCurrency = {};

    preBudgetPlan.preBudgetPlanActivities.forEach((activity) => {
      const currency = activity.currency;
      estimatedAmountByCurrency[currency] =
        Number(estimatedAmountByCurrency[currency] || 0) +
        Number(activity.estimatedAmount);
    });

    await this.repositoryPreBudgetPlan.update(preBudgetPlan.id, {
      estimatedAmount: estimatedAmountByCurrency,
    });
  }
}
