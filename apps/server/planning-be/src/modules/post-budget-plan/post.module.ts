import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostBudgetPlan,
  PostBudgetPlanDisbursement,
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PostBudgetPlanTimeline,
  Budget,
  PostBudgetActivityDocument,
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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UtilityModule } from '../utility/utility.module';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PostBudgetActivityDocumentController } from './controllers/post-budget-activity-documents.controller';
import { PostBudgetActivityDocumentService } from './services/post-budget-activity-documents.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

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
      PostBudgetActivityDocument,
    ]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'workflow-broadcast-exchanges',
          type: 'direct', // You can change this to 'topic', 'fanout', etc. as needed
        },
      ],
      uri: process.env.RMQ_URL, // Replace with your RabbitMQ URI
      enableControllerDiscovery: true,
    }),
    ClientsModule.register([
      {
        name: 'PLANNING_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'work-plan-initiate',
          queueOptions: {
            durable: false,
          },
        },
      },
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
    MinIOModule,
    UtilityModule,
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
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
    PostBudgetActivityDocumentService,
  ],
  controllers: [
    PostBudgePlantDisbursementController,
    PostBudgetPlanActivityController,
    PostBudgetPlanItemController,
    PostBudgetPlanTimelineController,
    PostBudgetPlanController,
    PostProcurementMechanismController,
    PostBudgetRequisitionerController,
    PostBudgetActivityDocumentController,
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
