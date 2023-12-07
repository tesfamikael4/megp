import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  APP,
  PreBudgetPlan,
  PreBudgetPlanActivity,
  PreBudgetPlanItems,
} from 'src/entities';
import { DataResponseFormat } from 'src/shared/api-data';
import { PostBudgetPlanService } from 'src/modules/post-budget-plan/services/post-budget-plan.service';
import { PostBudgetPlanActivityService } from 'src/modules/post-budget-plan/services/post-budget-plan-activity.service';
import { PostBudgetPlanItemsService } from 'src/modules/post-budget-plan/services/post-budget-plan-items.service';
import { v4 as uuidv4 } from 'uuid';
import { ExtraCrudService } from 'src/shared/service';
import { CollectionQuery, QueryConstructor } from 'src/shared/collection-query';

@Injectable()
export class PreBudgetPlanService extends ExtraCrudService<PreBudgetPlan> {
  constructor(
    @InjectRepository(PreBudgetPlan)
    private readonly repositoryPreBudgetPlan: Repository<PreBudgetPlan>,
    @InjectRepository(PreBudgetPlanActivity)
    private readonly preBudgetActivityRepository: Repository<PreBudgetPlanActivity>,
    @InjectRepository(PreBudgetPlanItems)
    private readonly preBudgetItemsRepository: Repository<PreBudgetPlanItems>,

    private readonly postBudgetPlanService: PostBudgetPlanService,
    private readonly postBudgetPlanActivityService: PostBudgetPlanActivityService,
    private readonly postBudgetPlanItemsService: PostBudgetPlanItemsService,
  ) {
    super(repositoryPreBudgetPlan);
  }

  async findPreBudgetPlans(query: CollectionQuery) {
    query.includes.push('app');
    const dataQuery = QueryConstructor.constructQuery<PreBudgetPlan>(
      this.repositoryPreBudgetPlan,
      query,
    );

    const response = new DataResponseFormat<PreBudgetPlan>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async copySelectedPreToPost(preBudgetPlanID: string): Promise<void> {
    try {
      const sourceEntity = await this.repositoryPreBudgetPlan.findOneOrFail({
        where: { id: preBudgetPlanID },
      });

      await this.repositoryPreBudgetPlan.update(sourceEntity.id, {
        status: 'Approved',
      });

      const activities = await this.preBudgetActivityRepository.find({
        where: { preBudgetPlanId: preBudgetPlanID },
        relations: ['preBudgetPlanItems'],
      });

      const postBudget = await this.postBudgetPlanService.create({
        ...sourceEntity,
        status: 'Draft',
        preBudgetPlanId: preBudgetPlanID,
        id: undefined,
      });

      const act: any = activities.map((activity) => ({
        ...activity,
        postBudgetPlanId: postBudget.id,
      }));

      await this.postBudgetPlanActivityService.create(act);

      act.forEach(async (element) => {
        await this.postBudgetPlanItemsService.create(
          element.preBudgetPlanItems.map((item) => ({
            ...item,
            postBudgetPlanActivityId: element.id,
            id: undefined,
          })) as any,
        );
      });
    } catch (error) {
      throw error;
    }
  }
}
