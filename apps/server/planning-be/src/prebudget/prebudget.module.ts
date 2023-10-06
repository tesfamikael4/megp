import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanInitiation } from './entities/plan-initiation.entity';
import { PrebudgetPlan } from './entities/prebudget-plan.entity';
import { PrebudgetPlanItem } from './entities/prebudget-item.entity';
import { PlanInitiationService } from './services/plan-initaiation.service';
import { PlanInitiationController } from './controllers/plan-initiation.controller';
import { PrebudgetPlanService } from './services/prebudget-plan.service';
import { PrebudgetPlanController } from './controllers/prebudget-plan.controller';
import { PrebudgetPlanItemService } from './services/prebudget-item.service';
import { PrebudgetPlanItemController } from './controllers/prebudget-item.controller';
import { ExtraPrebudgetItemsController } from './controllers/extras/extra-prebudget-items.controllers';
import { ExtraPrebudgetItemsService } from './services/extras/extra-prebudget-items.service';
import { ApprovalController } from './controllers/approval.controller';
import { ApprovalService } from './services/approval.service';
import { Approval } from './entities/approval.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanInitiation,
      PrebudgetPlan,
      PrebudgetPlanItem,
      Approval,
    ]),
  ],
  providers: [
    PlanInitiationService,
    PrebudgetPlanService,
    PrebudgetPlanItemService,
    ExtraPrebudgetItemsService,
    ApprovalService,
  ],
  controllers: [
    PlanInitiationController,
    PrebudgetPlanController,
    PrebudgetPlanItemController,
    ExtraPrebudgetItemsController,
    ApprovalController,
  ],
})
export class PrebudgetModule {}
