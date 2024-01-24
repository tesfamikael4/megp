import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostBudgetPlan } from 'src/entities';
import { PostBudgetPlanService } from '../services/post-budget-plan.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import {
  CollectionQuery,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import {
  AllowAnonymous,
  ApiKeyGuard,
  CurrentUser,
} from 'src/shared/authorization';
import { TransactionInterceptor } from 'src/shared/interceptors';
import { EventPattern } from '@nestjs/microservices';

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

  @Get(':id/target-group-percentage')
  async getTargetGroupPercentage(@Param('id') preBudgetPlanId: string) {
    return await this.postBudgetPlanService.calculateTargetGroupPercentage(
      preBudgetPlanId,
    );
  }

  @Get('get-analytics/:id')
  @ApiPaginatedResponse(PostBudgetPlan)
  async getAnalytics(@Param('id') id: string) {
    return await this.postBudgetPlanService.getAnalytics(id);
  }

  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  @Get('get-with-app/pr')
  @ApiPaginatedResponse(PostBudgetPlan)
  async getPostBudgetWithAppPr(
    @Query('q') q: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.postBudgetPlanService.findPostBudgetPlans(
      organizationId,
      q,
    );
  }
}
