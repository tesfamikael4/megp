import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  APP,
  BudgetYear,
  PostBudgetPlan,
  PreBudgetPlan,
  PreBudgetPlanActivity,
  PreBudgetPlanItems,
  PreBudgetPlanTimeline,
  PreBudgetRequisitioner,
  PreProcurementMechanism,
} from 'src/entities';
import { APPService } from './services/app.service';
import { PreBudgetPlanActivityService } from './services/pre-budget-plan-activity.service';
import { PreBudgetPlanItemsService } from './services/pre-budget-plan-items.service';
import { PreBudgetPlanTimelineService } from './services/pre-budget-plan-timeline.service';
import { APPController } from './controllers/app.controller';
import { PreBudgetPlanActivityController } from './controllers/pre-budget-plan-activity.controller';
import { PreBudgetPlanItemsController } from './controllers/pre-budget-plan-items.controller';
import { PreBudgetPlanTimelineController } from './controllers/pre-budget-plan-timeline.controller';
import { PreBudgetPlanController } from './controllers/pre-budget-plan.controller';
import { PostBudgetPlanService } from '../post-budget-plan/services/post-budget-plan.service';
import { PreBudgetPlanService } from './services/pre-budget-plan.service';
import { PostModule } from '../post-budget-plan/post.module';
import { BudgetController } from './controllers/budget.controller';
import { BudgetService } from './services/budget.service';
import { Budget } from 'src/entities/budget.entity';
import { PreProcurementMechanismController } from './controllers/pre-procurement-mechanism.controller';
import { PreProcurementMechanismService } from './services/pre-procurement-mechanism.service';
import { PreBudgetRequisitionerService } from './services/pre-budget-requisitioner.service';
import { PreBudgetRequisitionerController } from './controllers/pre-budget-requisitioner.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      APP,
      Budget,
      BudgetYear,
      PreBudgetPlanActivity,
      PreBudgetPlanItems,
      PreBudgetPlanTimeline,
      PreBudgetPlan,
      PreProcurementMechanism,
      PreBudgetRequisitioner,
    ]),
    ClientsModule.register([
      {
        name: 'PLANNING_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672/'],
          queue: 'work-plan',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PostModule,
  ],
  providers: [
    APPService,
    BudgetService,
    PreBudgetPlanActivityService,
    PreBudgetPlanItemsService,
    PreBudgetPlanTimelineService,
    PreBudgetPlanService,
    // PostBudgetPlanService,
    PreProcurementMechanismService,
    PreBudgetRequisitionerService,
    // BudgetYearService
  ],
  controllers: [
    APPController,
    BudgetController,
    PreBudgetPlanActivityController,
    PreBudgetPlanItemsController,
    PreBudgetPlanTimelineController,
    PreBudgetPlanController,
    PreProcurementMechanismController,
    PreBudgetRequisitionerController,
  ],
})
export class APPModule {}
