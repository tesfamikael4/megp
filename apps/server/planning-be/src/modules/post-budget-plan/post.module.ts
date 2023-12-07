import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostBudgetPlan,
  PostBudgetPlanDisbursement,
  PostBudgetPlanActivity,
  PostBudgetPlanFrameworkContract,
  PostBudgetPlanItems,
  PostBudgetPlanTimeline,
} from 'src/entities';
import { PostBudgetPlanDisbursementService } from './services/post-budget-plan-disbursement.service';
import { PostBudgetPlanActivityService } from './services/post-budget-plan-activity.service';
import { PostBudgetPlanFrameworkContractService } from './services/post-budget-plan-framework-contract.service';
import { PostBudgetPlanItemsService } from './services/post-budget-plan-items.service';
import { PostBudgetPlanTimelineService } from './services/post-budget-plan-timeline.service';
import { PostBudgePlantDisbursementController } from './controllers/post-budget-plan-disbursement.controller';
import { PostBudgetPlanActivityController } from './controllers/post-budget-plan-activity.controller';
import { PostBudgetPlanFrameworkContractController } from './controllers/post-budget-plan-framework-contract.controller';
import { PostBudgetPlanItemsController } from './controllers/post-budget-plan-items.controller';
import { PostBudgetPlanTimelineController } from './controllers/post-budget-plan-timeline.controller';
import { PostBudgetPlanController } from './controllers/post-budget-plan.controller';
import { PostBudgetPlanService } from '../post-budget-plan/services/post-budget-plan.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostBudgetPlanDisbursement,
      PostBudgetPlanActivity,
      PostBudgetPlanFrameworkContract,
      PostBudgetPlanItems,
      PostBudgetPlanTimeline,
      PostBudgetPlan,
    ]),
  ],
  providers: [
    PostBudgetPlanDisbursementService,
    PostBudgetPlanActivityService,
    PostBudgetPlanFrameworkContractService,
    PostBudgetPlanItemsService,
    PostBudgetPlanTimelineService,
    PostBudgetPlanService,
  ],
  controllers: [
    PostBudgePlantDisbursementController,
    PostBudgetPlanActivityController,
    PostBudgetPlanFrameworkContractController,
    PostBudgetPlanItemsController,
    PostBudgetPlanTimelineController,
    PostBudgetPlanController,
  ],
  exports: [
    PostBudgetPlanService,
    PostBudgetPlanActivityService,
    PostBudgetPlanItemsService,
  ],
})
export class PostModule {}
