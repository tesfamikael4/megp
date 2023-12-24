import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostBudgetPlan,
  PostBudgetPlanDisbursement,
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PostBudgetPlanTimeline,
} from 'src/entities';
import { PostBudgetPlanDisbursementService } from './services/post-budget-plan-disbursement.service';
import { PostBudgetPlanActivityService } from './services/post-budget-plan-activity.service';
import { PostBudgetPlanItemService } from './services/post-budget-plan-items.service';
import { PostBudgetPlanTimelineService } from './services/post-budget-plan-timeline.service';
import { PostBudgePlantDisbursementController } from './controllers/post-budget-plan-disbursement.controller';
import { PostBudgetPlanActivityController } from './controllers/post-budget-plan-activity.controller';
import { PostBudgetPlanItemController } from './controllers/post-budget-plan-items.controller';
import { PostBudgetPlanTimelineController } from './controllers/post-budget-plan-timeline.controller';
import { PostBudgetPlanController } from './controllers/post-budget-plan.controller';
import { PostBudgetPlanService } from '../post-budget-plan/services/post-budget-plan.service';
import { PostProcurementMechanismService } from './services/post-procurement-mechanism.service';
import { PostProcurementMechanismController } from './controllers/post-procurement-mechanism.controller';
import { PostProcurementMechanism } from 'src/entities/post-procurement-mechanism.entity';
import { PostBudgetRequisitionerController } from './controllers/post-budget-requisitioner.controller';
import { PostBudgetRequisitionerService } from './services/post-budget-requisitioner.service';
import { PostBudgetRequisitioner } from 'src/entities/post-budget-plan-requisitioner.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostBudgetPlanDisbursement,
      PostBudgetPlanActivity,
      PostBudgetPlanItem,
      PostBudgetPlanTimeline,
      PostBudgetPlan,
      PostProcurementMechanism,
      PostBudgetRequisitioner,
    ]),
  ],
  providers: [
    PostBudgetPlanDisbursementService,
    PostBudgetPlanActivityService,
    PostBudgetPlanItemService,
    PostBudgetPlanTimelineService,
    PostBudgetPlanService,
    PostProcurementMechanismService,
    PostBudgetRequisitionerService,
  ],
  controllers: [
    PostBudgePlantDisbursementController,
    PostBudgetPlanActivityController,
    PostBudgetPlanItemController,
    PostBudgetPlanTimelineController,
    PostBudgetPlanController,
    PostProcurementMechanismController,
    PostBudgetRequisitionerController,
  ],
  exports: [
    PostBudgetPlanService,
    PostBudgetPlanActivityService,
    PostBudgetPlanItemService,
    PostBudgetPlanTimelineService,
    PostBudgetRequisitionerService,
    PostProcurementMechanismService,
  ],
})
export class PostModule {}
