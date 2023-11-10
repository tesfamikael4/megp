import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  APP,
  PreBudgePlantDisbursement,
  PreBudgetPlan,
  PreBudgetPlanActivity,
  PreBudgetPlanFrameworkContract,
  PreBudgetPlanItems,
  PreBudgetPlanTimeline,
} from 'src/entities';
import { APPService } from './services/app.service';
import { PreBudgePlantDisbursementService } from './services/pre-budge-plant-disbursement.service';
import { PreBudgetPlanActivityService } from './services/pre-budget-plan-activity.service';
import { PreBudgetPlanFrameworkContractService } from './services/pre-budget-plan-framework-contract.service';
import { PreBudgetPlanItemsService } from './services/pre-budget-plan-items.service';
import { PreBudgetPlanTimelineService } from './services/pre-budget-plan-timeline.service';
import { PreBudgetPlanService } from './services/pre-budget-plan.service';
import { APPController } from './controllers/app.controller';
import { PreBudgePlantDisbursementController } from './controllers/pre-budge-plant-disbursement.controller';
import { PreBudgetPlanActivityController } from './controllers/pre-budget-plan-activity.controller';
import { PreBudgetPlanFrameworkContractController } from './controllers/pre-budget-plan-framework-contract.controller';
import { PreBudgetPlanItemsController } from './controllers/pre-budget-plan-items.controller';
import { PreBudgetPlanTimelineController } from './controllers/pre-budget-plan-timeline.controller';
import { PreBudgetPlanController } from './controllers/pre-budget-plan.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      APP,
      PreBudgePlantDisbursement,
      PreBudgetPlanActivity,
      PreBudgetPlanFrameworkContract,
      PreBudgetPlanItems,
      PreBudgetPlanTimeline,
      PreBudgetPlan,
    ]),
  ],
  providers: [
    APPService,
    PreBudgePlantDisbursementService,
    PreBudgetPlanActivityService,
    PreBudgetPlanFrameworkContractService,
    PreBudgetPlanItemsService,
    PreBudgetPlanTimelineService,
    PreBudgetPlanService,
  ],
  controllers: [
    APPController,
    PreBudgePlantDisbursementController,
    PreBudgetPlanActivityController,
    PreBudgetPlanFrameworkContractController,
    PreBudgetPlanItemsController,
    PreBudgetPlanTimelineController,
    PreBudgetPlanController,
  ],
})
export class APPModule {}
