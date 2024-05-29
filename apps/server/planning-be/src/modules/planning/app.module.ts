import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  APP,
  BudgetYear,
  PostBudgetPlanActivity,
  PostBudgetPlanItem,
  PreBudgetActivityDocument,
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
import { PreBudgetPlanService } from './services/pre-budget-plan.service';
import { PostModule } from '../post-budget-plan/post.module';
import { BudgetController } from './controllers/budget.controller';
import { BudgetService } from './services/budget.service';
import { Budget } from 'src/entities/budget.entity';
import { PreProcurementMechanismController } from './controllers/pre-procurement-mechanism.controller';
import { PreProcurementMechanismService } from './services/pre-procurement-mechanism.service';
import { PreBudgetRequisitionerService } from './services/pre-budget-requisitioner.service';
import { PreBudgetRequisitionerController } from './controllers/pre-budget-requisitioner.controller';
import * as dotenv from 'dotenv';
import { PreBudgetActivityDocumentController } from './controllers/pre-budget-activity-documents.controller';
import { PreBudgetActivityDocumentService } from './services/pre-budget-activity-documents.service';
import { MinioModule } from 'nestjs-minio-client';
import { UtilityModule } from '../utility/utility.module';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { HashModule } from 'src/shared/hash/hash.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

dotenv.config({ path: '.env' });

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
      PreBudgetActivityDocument,
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
    PostModule,
    MinIOModule,
    HashModule,
    UtilityModule,
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT ?? 'files.megp.peragosystems.com',
      port: Number(process.env.MINIO_PORT ?? 80),
      useSSL: Boolean(process.env.MINIO_USESSL ?? false),
      accessKey: process.env.MINIO_ACCESSKEY ?? 'Szzt6Zo5yEJCfa7ay5sy',
      secretKey:
        process.env.MINIO_SECRETKEY ??
        'dGtjFGcLjKU6pXRYx1tOnqGeycJtxJoavgwqYgDd',
    }),
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
    APPService,
    BudgetService,
    PreBudgetPlanActivityService,
    PreBudgetPlanItemsService,
    PreBudgetPlanTimelineService,
    PreBudgetPlanService,
    // PostBudgetPlanService,
    PreProcurementMechanismService,
    PreBudgetRequisitionerService,
    PreBudgetActivityDocumentService,
    // HashService,
    // ReasonService
    PostBudgetPlanActivity,
    PostBudgetPlanItem,
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
    PreBudgetActivityDocumentController,
  ],
})
export class APPModule {}
