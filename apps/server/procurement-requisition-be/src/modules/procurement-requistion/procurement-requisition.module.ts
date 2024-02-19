import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementRequisitionController } from './controllers/procurement-requisition.controller';
import { ProcurementRequisitionService } from './services/procurement-requisition.service';
import {
  Document,
  Item,
  ProcurementMechanism,
  ProcurementRequisition,
  TechnicalTeam,
  Timeline,
} from 'src/entities';
import { TechnicalTeamService } from './services/technical-team.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocumentController } from './controllers/document.controller';
import { ItemController } from './controllers/item.controller';
import { ProcurementMechanismController } from './controllers/procurement-mechanism.controller';
import { TechnicalTeamController } from './controllers/tchnica-team.controller';
import { TimelineController } from './controllers/timeline.controller';
import { DocumentService } from './services/document.service';
import { ItemService } from './services/item.service';
import { ProcurementMechanismService } from './services/procurement-mechanism.service';
import { TimelineService } from './services/timeline.service';
import { MinIOModule } from 'src/shared/min-io/min-io.module';

@Module({
  imports: [
    MinIOModule,
    TypeOrmModule.forFeature([
      ProcurementRequisition,
      Document,
      Item,
      Timeline,
      TechnicalTeam,
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
    DocumentService,
    ItemService,
    TechnicalTeamService,
    ProcurementMechanismService,
    TimelineService,
  ],
  controllers: [
    ProcurementRequisitionController,
    DocumentController,
    TechnicalTeamController,
    ItemController,
    ProcurementMechanismController,
    TimelineController,
  ],
})
export class ProcurementRequisitionModule {}
