import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Budget, PostBudgetPlan, PostBudgetPlanActivity } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BudgetService } from 'src/modules/planning/services/budget.service';

@Injectable()
export class PostBudgetPlanActivityService extends ExtraCrudService<PostBudgetPlanActivity> {
  constructor(
    @InjectRepository(PostBudgetPlanActivity)
    private readonly repositoryPostBudgetPlanActivity: Repository<PostBudgetPlanActivity>,
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,
    // private readonly budgetService: BudgetService,
    @InjectRepository(Budget)
    private readonly repositoryBudget: Repository<Budget>,
    private eventEmitter: EventEmitter2,

    private dataSource: DataSource,
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

  async addBudget(payload): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const budget = await this.repositoryBudget.findOne({
        where: { id: payload.budgetId },
      });
      if (!budget) {
        throw new NotFoundException(`Budget not found`);
      }
      const activity = await this.repositoryPostBudgetPlanActivity.findOneBy({
        id: payload.postBudgetPlanActivityId,
      });
      if (activity.budgetId == null) {
        if (+budget.availableBudget < +activity.estimatedAmount) {
          throw new HttpException(
            `Available budget is less than estimated Amount`,
            430,
          );
        }
        await this.repositoryPostBudgetPlanActivity.update(
          payload.postBudgetPlanActivityId,
          {
            budgetId: payload.budgetId,
          },
        );
        if (budget.revisedBudget == 0) {
        }
        await this.repositoryBudget.update(payload.budgetId, {
          obligatedBudget: +budget.obligatedBudget + +activity.estimatedAmount,
          availableBudget: +budget.revisedBudget - +activity.estimatedAmount,
        });
      } else {
        await this.changeBudget(payload);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async changeBudget(payload): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const budget = await this.repositoryBudget.findOne({
        where: {
          id: payload.budgetId,
        },
      });
      if (!budget) {
        throw new NotFoundException(`Budget not found`);
      }
      const activity = await this.repositoryPostBudgetPlanActivity.findOneBy({
        id: payload.postBudgetPlanActivityId,
      });
      const prevBudget = await this.repositoryBudget.findOne({
        where: {
          id: activity.budgetId,
        },
      });
      if (+budget.availableBudget < +activity.estimatedAmount) {
        throw new HttpException(
          `Available budget is less than estimated Amount`,
          430,
        );
      }
      //release the previous budget amount
      await this.repositoryBudget.update(activity.budgetId, {
        obligatedBudget:
          +prevBudget.obligatedBudget - +activity.estimatedAmount,
        availableBudget:
          +prevBudget.availableBudget + +activity.estimatedAmount,
      });

      //update the new budget amount
      await this.repositoryBudget.update(payload.budgetId, {
        obligatedBudget: +budget.obligatedBudget + +activity.estimatedAmount,
        availableBudget: +budget.revisedBudget - +activity.estimatedAmount,
      });
      await this.repositoryPostBudgetPlanActivity.update(
        payload.postBudgetPlanActivityId,
        {
          budgetId: payload.budgetId,
        },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
