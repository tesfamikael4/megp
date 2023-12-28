import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataResponseFormat } from 'src/shared/api-data';
import { PostBudgetPlan } from 'src/entities/post-budget-plan.entity';
import {
  FilterOperators,
  QueryConstructor,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class PostBudgetPlanService extends ExtraCrudService<PostBudgetPlan> {
  constructor(
    @InjectRepository(PostBudgetPlan)
    private readonly repositoryPostBudgetPlan: Repository<PostBudgetPlan>,
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
}
