import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlan } from 'src/entities';
import { PostBudgetPlanService } from '../services/post-budget-plan.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('post-budget-plans')
@ApiTags('post-budget-plans')
export class PostBudgetPlanController extends ExtraCrudController<PostBudgetPlan>(
  options,
) {
  constructor(private readonly postBudgetPlanService: PostBudgetPlanService) {
    super(postBudgetPlanService);
  }
  async create(
    @Body() itemData: PostBudgetPlan,
    @CurrentUser() user,
  ): Promise<PostBudgetPlan> {
    itemData.organizationId = user.organization.id;
    return this.postBudgetPlanService.create(itemData);
  }

  @Get('get-with-app')
  @ApiPaginatedResponse(PostBudgetPlan)
  async getPostBudgetWithApp(@Query('q') q: string, @CurrentUser() user) {
    const organizationId = user.organization.id;
    return await this.postBudgetPlanService.findPostBudgetPlans(
      organizationId,
      q,
    );
  }
}
