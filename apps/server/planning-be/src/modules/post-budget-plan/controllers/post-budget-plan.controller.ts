import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlan } from 'src/entities';
import { PostBudgetPlanService } from '../services/post-budget-plan.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanId',
};

@Controller('post-budget-plans')
@ApiTags('post-budget-plans')
export class PostBudgetPlanController extends ExtraCrudController<PostBudgetPlan>(
  options,
) {
  constructor(private readonly postBudgetPlanService: PostBudgetPlanService) {
    super(postBudgetPlanService);
  }

  @Get('get-with-app')
  @ApiPaginatedResponse(PostBudgetPlan)
  async getPreBudgetWithApp(@Query() query: CollectionQuery) {
    return await this.postBudgetPlanService.findPostBudgetPlans(query);
  }
}
