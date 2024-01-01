import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostBudgetPlan, PostBudgetPlanActivity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PostBudgetPlanActivityService extends ExtraCrudService<PostBudgetPlanActivity> {
  constructor(
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,
    private eventEmitter: EventEmitter2,
  ) {
    super(repositoryPostBudgetPlanActivity);
  }
  async create(itemData: any): Promise<any> {
    const activity =
      await this.repositoryPostBudgetPlanActivity.create(itemData);
    const plan = await this.repositoryPostBudgetPlan.findOne({
      where: {
        id: itemData.postBudgetPlanId,
      },
      relations: ['postBudgetPlanActivities'],
    });
    if (!plan) {
      throw new NotFoundException(`PostBudgetPlan not found`);
    }

    await this.repositoryPostBudgetPlanActivity.insert(activity);
    this.eventEmitter.emit('post.recalculate', {
      postBudgetPlanId: itemData.postBudgetPlanId,
    });

    return activity;
  }
  async recalculateTotalEstimatedAmount(payload): Promise<void> {
    const postBudgetPlan = await this.repositoryPostBudgetPlan.findOne({
      where: {
        id: payload.postBudgetPlanId,
      },
      relations: ['postBudgetPlanActivities'],
    });
    if (!postBudgetPlan) {
      throw new NotFoundException(`PostBudgetPlan not found`);
    }
    const estimatedAmountByCurrency = {};

    postBudgetPlan.postBudgetPlanActivities.forEach((activity) => {
      const currency = activity.currency;
      estimatedAmountByCurrency[currency] =
        Number(estimatedAmountByCurrency[currency] || 0) +
        Number(activity.estimatedAmount);
    });

    await this.repositoryPostBudgetPlan.update(postBudgetPlan.id, {
      estimatedAmount: estimatedAmountByCurrency,
    });
  }
}
