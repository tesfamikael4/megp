import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  APP,
  PostBudgetPlan,
  PreBudgetPlanDisbursement,
  PreBudgetPlan,
  PreBudgetPlanActivity,
  PreBudgetPlanFrameworkContract,
  PreBudgetPlanItems,
  PreBudgetPlanTimeline,
} from 'src/entities';
import { APPService } from './services/app.service';
import { PreBudgetPlanDisbursementService } from './services/pre-budget-plan-disbursement.service';
import { PreBudgetPlanActivityService } from './services/pre-budget-plan-activity.service';
import { PreBudgetPlanFrameworkContractService } from './services/pre-budget-plan-framework-contract.service';
import { PreBudgetPlanItemsService } from './services/pre-budget-plan-items.service';
import { PreBudgetPlanTimelineService } from './services/pre-budget-plan-timeline.service';
import { APPController } from './controllers/app.controller';
import { PreBudgetPlanDisbursementController } from './controllers/pre-budget-plan-disbursement.controller';
import { PreBudgetPlanActivityController } from './controllers/pre-budget-plan-activity.controller';
import { PreBudgetPlanFrameworkContractController } from './controllers/pre-budget-plan-framework-contract.controller';
import { PreBudgetPlanItemsController } from './controllers/pre-budget-plan-items.controller';
import { PreBudgetPlanTimelineController } from './controllers/pre-budget-plan-timeline.controller';
import { PreBudgetPlanController } from './controllers/pre-budget-plan.controller';
import { PostBudgetPlanService } from '../post-budget-plan/services/post-budget-plan.service';
import { PreBudgetPlanService } from './services/pre-budget-plan.service';
import { PostModule } from '../post-budget-plan/post.module';
import { BudgetController } from './controllers/budget.controller';
import { BudgetService } from './services/budget.service';
import { Budget } from 'src/entities/budget.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      APP,
      Budget,
      PreBudgetPlanDisbursement,
      PreBudgetPlanActivity,
      PreBudgetPlanFrameworkContract,
      PreBudgetPlanItems,
      PreBudgetPlanTimeline,
      PreBudgetPlan,
    ]),
    PostModule,
  ],
  providers: [
    APPService,
    BudgetService,
    PreBudgetPlanDisbursementService,
    PreBudgetPlanActivityService,
    PreBudgetPlanFrameworkContractService,
    PreBudgetPlanItemsService,
    PreBudgetPlanTimelineService,
    PreBudgetPlanService,
    // PostBudgetPlanService
  ],
  controllers: [
    APPController,
    BudgetController,
    PreBudgetPlanDisbursementController,
    PreBudgetPlanActivityController,
    PreBudgetPlanFrameworkContractController,
    PreBudgetPlanItemsController,
    PreBudgetPlanTimelineController,
    PreBudgetPlanController,
  ],
})
export class APPModule {}
