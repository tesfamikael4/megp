import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostBudgetPlan, PostBudgetPlanActivity } from 'src/entities';
import { PostBudgetPlanActivityController } from './controllers/post-budget-plan-activity';
import { PostBudgetPlanController } from './controllers/post-budget-plan.controller';
import { PostBudgetPlanActivityService } from './services/post-budget-plan-activity.service';
import { PostBudgetPlanService } from './services/post-budget-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostBudgetPlan, PostBudgetPlanActivity])],
  providers: [PostBudgetPlanService, PostBudgetPlanActivityService],
  controllers: [PostBudgetPlanController, PostBudgetPlanActivityController],
})
export class PostBudgetPlanModule {}
