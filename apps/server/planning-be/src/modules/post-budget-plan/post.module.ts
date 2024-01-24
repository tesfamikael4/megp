import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostBudgetPlan,
  PostBudgetPlanDisbursement,
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PostBudgetPlanTimeline,
  Budget,
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
import { MinioModule } from 'nestjs-minio-client';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Budget,
      PostBudgetPlanDisbursement,
      PostBudgetPlanActivity,
      PostBudgetPlanItem,
      PostBudgetPlanTimeline,
      PostBudgetPlan,
      PostProcurementMechanism,
      PostBudgetRequisitioner,
    ]),
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT ?? 'files.megp.peragosystems.com',
      port: Number(process.env.MINIO_PORT ?? 80),
      useSSL: Boolean(process.env.MINIO_USESSL ?? false),
      accessKey: process.env.MINIO_ACCESSKEY ?? 'Szzt6Zo5yEJCfa7ay5sy',
      secretKey:
        process.env.MINIO_SECRETKEY ??
        'dGtjFGcLjKU6pXRYx1tOnqGeycJtxJoavgwqYgDd',
    }),
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
