import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementRequisitionTechnicalTeamService } from './services/procurement-requisition-technical-team.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProcurementRequisitionDocumentController } from './controllers/procurement-requisition-document.controller';
import { ProcurementRequisitionItemController } from './controllers/procurement-requisition-item.controller';
import { ProcurementMechanismController } from './controllers/procurement-mechanism.controller';
import { ProcurementRequisitionTimelineController } from './controllers/procurement-requisition-timeline.controller';
import { ProcurementRequisitionDocumentService } from './services/procurement-requisition-document.service';
import { ProcurementMechanismService } from './services/procurement-mechanism.service';
import { ProcurementRequisitionTimelineService } from './services/procurement-requisition-timeline.service';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import {
  ProcurementMechanism,
  ProcurementRequisition,
  ProcurementRequisitionDocument,
  ProcurementRequisitionItem,
  ProcurementRequisitionTechnicalTeam,
  ProcurementRequisitionTimeline,
} from 'src/entities';
import { ProcurementRequisitionTechnicalTeamController } from './controllers/procurement-requisition-technical-team.controller';
import { ProcurementRequisitionItemService } from './services/procurement-requisition-item.service';
import { ProcurementRequisitionController } from './controllers/procurement-requisition.controller';
import { ProcurementRequisitionService } from './services/procurement-requisition.service';

@Module({
  imports: [
    MinIOModule,
    TypeOrmModule.forFeature([
      ProcurementRequisition,
      ProcurementRequisitionDocument,
      ProcurementRequisitionItem,
      ProcurementRequisitionTimeline,
      ProcurementRequisitionTechnicalTeam,
      ProcurementMechanism,
    ]),
    ClientsModule.register([
      {
        name: 'PR_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'pr-workflow-initiate',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    ProcurementRequisitionService,
    ProcurementRequisitionDocumentService,
    ProcurementRequisitionItemService,
    ProcurementRequisitionTechnicalTeamService,
    ProcurementMechanismService,
    ProcurementRequisitionTimelineService,
  ],
  controllers: [
    ProcurementRequisitionController,
    ProcurementRequisitionDocumentController,
    ProcurementRequisitionTechnicalTeamController,
    ProcurementRequisitionItemController,
    ProcurementMechanismController,
    ProcurementRequisitionTimelineController,
  ],
})
export class ProcurementRequisitionModule {}
