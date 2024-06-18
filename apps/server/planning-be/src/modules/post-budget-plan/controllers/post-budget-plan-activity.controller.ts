import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanActivity } from 'src/entities';
import { PostBudgetPlanActivityService } from '../services/post-budget-plan-activity.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AllowAnonymous,
  ApiKeyGuard,
  CurrentUser,
} from 'src/shared/authorization';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { PostAddBudgetDTO } from '../dtos/post-budget-add-budget.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanId',
};

@Controller('post-budget-plan-activities')
@ApiTags('post-budget-plan-activities')
export class PostBudgetPlanActivityController extends ExtraCrudController<PostBudgetPlanActivity>(
  options,
) {
  constructor(
    private readonly postBudgetPlanActivityService: PostBudgetPlanActivityService,
  ) {
    super(postBudgetPlanActivityService);
  }

  @Post()
  async create(
    @Body() itemData: any,
    @CurrentUser() user,
  ): Promise<PostBudgetPlanActivity> {
    itemData.organizationId = user.organization.id;
    itemData.organizationName = user.organization.name;
    return this.postBudgetPlanActivityService.create(itemData, user);
  }

  @OnEvent('post.recalculateEstimatedAmount')
  async recalculate(plan) {
    return await this.postBudgetPlanActivityService.recalculateTotalEstimatedAmount(
      plan,
    );
  }
  @AllowAnonymous()
  @Post('add-budget')
  @ApiBody({ type: PostAddBudgetDTO })
  async addBudget(@Body() payload: PostAddBudgetDTO) {
    return await this.postBudgetPlanActivityService.addBudget(payload);
  }

  @Get('with-budget/:budgetId')
  async getPostBudgetPlansWithBudgetId(@Param('budgetId') budgetId: string) {
    return await this.postBudgetPlanActivityService.getBudgets(budgetId);
  }

  @Post('change-budget')
  async changeBudget(@Body() payload: any) {
    // return await this.postBudgetPlanActivityService.changeBudget(payload);
  }

  //API's for purchase-requisition
  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  @Get('pr/list/:id')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async prFindAll(
    @Param('id') id: string,
    @Query('q') q: string,
    @Req() req?: any,
  ): Promise<any> {
    const query = decodeCollectionQuery(q);
    return this.postBudgetPlanActivityService.findAll(id, query, options);
  }

  @AllowAnonymous()
  @UseGuards(ApiKeyGuard)
  @Get('pr/:id')
  async prFindOne(@Param('id') id: string, @Req() req?: any): Promise<any> {
    return this.postBudgetPlanActivityService.findOne(id);
  }
}
