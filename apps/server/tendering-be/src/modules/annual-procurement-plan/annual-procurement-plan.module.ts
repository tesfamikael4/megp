import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AnnualProcurementPlan,
  AnnualProcurementPlanActivity,
  AnnualProcurementPlanItem,
  AnnualProcurementPlanTimeline,
  AnnualProcurementPlanBudgetLine,
  AnnualProcurementPlanDisbursement,
  RequisitionerAssignment,
  ProcurementMechanism,
} from 'src/entities';
import { AnnualProcurementPlanActivityController } from './controllers/annual-procurement-plan-activity.controller';
import { AnnualProcurementPlanActivityService } from './services/annual-procurement-plan-activity.service';
import { AnnualProcurementPlanDisbursementService } from './services/annual-procurement-plan-disbursement.service';
import { AnnualProcurementPlanService } from './services/annual-procurement-plan.service';
import { AnnualProcurementPlanItemService } from './services/procurement-requisition-item.service';
import { AnnualProcurementPlanTimelineService } from './services/annual-procurement-plan-timeline.service';
import { ProcurementMechanismService } from './services/procurement-mechanism.service';
import { RequisitionerAssignmentService } from './services/requisitioner-assignment.service';
import { AnnualProcurementPlanDisbursementController } from './controllers/procurement-requisition-disbursement.controller';
import { AnnualProcurementPlanTimelineController } from './controllers/procurement-requisition-timeline.controller';
import { AnnualProcurementPlanController } from './controllers/annual-procurement-Plan.controller';
import { AnnualProcurementPlanItemController } from './controllers/annual-procurement-plan-item.controller';
import { ProcurementMechanismController } from './controllers/requisition-mechanism.controller';
import { RequisitionerAssignmentController } from './controllers/requisitioner-assignment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnnualProcurementPlan,
      AnnualProcurementPlanActivity,
      AnnualProcurementPlanItem,
      AnnualProcurementPlanTimeline,
      RequisitionerAssignment,
      AnnualProcurementPlanBudgetLine,
      ProcurementMechanism,
      AnnualProcurementPlanDisbursement,
    ]),
  ],
  providers: [
    AnnualProcurementPlanService,
    AnnualProcurementPlanActivityService,
    AnnualProcurementPlanItemService,
    RequisitionerAssignmentService,
    ProcurementMechanismService,
    AnnualProcurementPlanDisbursementService,
    AnnualProcurementPlanTimelineService,
  ],
  controllers: [
    AnnualProcurementPlanController,
    AnnualProcurementPlanActivityController,
    AnnualProcurementPlanItemController,
    RequisitionerAssignmentController,
    ProcurementMechanismController,
    AnnualProcurementPlanDisbursementController,
    AnnualProcurementPlanTimelineController,
  ],
})
export class AnnualProcurementPlanModule {}
