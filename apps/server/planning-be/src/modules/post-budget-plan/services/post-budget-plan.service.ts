import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { PostBudgetPlan } from 'src/entities/post-budget-plan.entity';
import {
  FilterOperators,
  QueryConstructor,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { ExtraCrudService } from 'src/shared/service';
import { PostBudgetPlanActivity } from 'src/entities';

@Injectable()
export class PostBudgetPlanService extends ExtraCrudService<PostBudgetPlan> {
  constructor(
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,

    @InjectRepository(PostBudgetPlanActivity)
    private readonly postBudgetActivityRepository: Repository<PostBudgetPlanActivity>,
  ) {
    super(repositoryPostBudgetPlan);
  }
  async findPostBudgetPlans(organizationId: string, q: string) {
    const query = decodeCollectionQuery(q);
    query.where.push([
      {
        column: 'organizationId',
        value: organizationId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    query.includes.push('preBudgetPlan');
    query.includes.push('app');
    const dataQuery = QueryConstructor.constructQuery<PostBudgetPlan>(
      this.repositoryPostBudgetPlan,
      query,
    );
    const response = new DataResponseFormat<PostBudgetPlan>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
  async getAnalytics(postBudgetPlanId: string): Promise<{
    totalActivities: number;
    currencyTotalAmounts: Record<string, number>;
    targetGroupPercentages: Record<string, number>;
  }> {
    const postBudgetPlan = await this.repositoryPostBudgetPlan.findOne({
      where: { id: postBudgetPlanId },
      relations: [
        'postBudgetPlanActivities',
        'postBudgetPlanActivities.postBudgetPlanItems',
      ],
    });

    if (!postBudgetPlan) {
      throw new NotFoundException(`PostBudgetPlan not found`);
    }
    const currencyTotalAmounts: Record<string, number> = {};
    let totalAmount = 0;
    const totalActivities = postBudgetPlan.postBudgetPlanActivities.length;

    postBudgetPlan.postBudgetPlanActivities.forEach((activity) => {
      activity.postBudgetPlanItems.forEach((item) => {
        const itemTotalAmount = item.quantity * item.unitPrice;
        totalAmount += itemTotalAmount;

        const currency = item.currency;

        if (currencyTotalAmounts[currency]) {
          currencyTotalAmounts[currency] += itemTotalAmount;
        } else {
          currencyTotalAmounts[currency] = itemTotalAmount;
        }
      });
    });
    const targetGroupPercentages: Record<string, number> =
      await this.calculateTargetGroupPercentage(postBudgetPlanId);
    return { totalActivities, currencyTotalAmounts, targetGroupPercentages };
  }

  async calculateTargetGroupPercentage(
    postBudgetPlanId: string,
  ): Promise<Record<string, number>> {
    const postBudgetPlan = await this.repositoryPostBudgetPlan.findOne({
      where: { id: postBudgetPlanId },
      relations: [
        'postBudgetPlanActivities',
        'postBudgetPlanActivities.postProcurementMechanisms',
      ],
    });

    if (!postBudgetPlan) {
      throw new NotFoundException(`PostBudgetPlan not found`);
    }

    const targetGroupCounts: Record<string, number> = {};

    postBudgetPlan.postBudgetPlanActivities.forEach((activity) => {
      activity.postProcurementMechanisms.forEach((mechanism) => {
        const targetGroups = mechanism.targetGroup || [];

        targetGroups.forEach((group) => {
          targetGroupCounts[group] = (targetGroupCounts[group] || 0) + 1;
        });
      });
    });

    const totalMechanisms = postBudgetPlan.postBudgetPlanActivities.reduce(
      (total, activity) => total + activity.postProcurementMechanisms.length,
      0,
    );

    const targetGroupPercentages: Record<string, number> = {};

    for (const group in targetGroupCounts) {
      const percentage = (targetGroupCounts[group] / totalMechanisms) * 100;
      targetGroupPercentages[group] = percentage;
    }

    return targetGroupPercentages;
  }
}
