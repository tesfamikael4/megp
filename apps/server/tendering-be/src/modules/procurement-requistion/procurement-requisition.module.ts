import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementRequisitionController } from './controllers/procurement-requisition.controller';
import { ProcurementRequisitionService } from './services/procurement-requisition.service';
import {
  AnnualProcurementPlanActivity,
  ProcurementRequisition,
  ProcurementRequisitionActivity,
  ProcurementRequisitionBudgetLine,
  ProcurementRequisitionDisbursement,
  ProcurementRequisitionDocument,
  ProcurementRequisitionItem,
  ProcurementRequisitionItemReference,
  ProcurementRequisitionMechanism,
  ProcurementRequisitionOfficerAssignment,
  ProcurementRequisitionTimeline,
} from 'src/entities';
import { ProcurementRequisitionActivityController } from './controllers/procurement-requisition-activity.controller';
import { ProcurementRequisitionDocumentController } from './controllers/procurement-requisition-document.controller';
import { ProcurementRequisitionActivityService } from './services/procurement-requisition-activity.service';
import { ProcurementRequisitionDocumentService } from './services/procurement-requisition-document.service';
import { ProcurementRequisitionItemService } from './services/procurement-requisition-item.service';
import { ProcurementRequisitionItemController } from './controllers/procurement-requisition-item.controller';
import { ProcurementRequisitionItemReferenceService } from './services/procurement-requisition-item-reference.service';
import { ProcurementRequisitionOfficerAssignmentService } from './services/procurement-requisition-officer-assignment.service';
import { ProcurementRequisitionOfficerAssignmentController } from './controllers/procurement-requisition-officer-assignment.controller';
import { ProcurementRequisitionMechanismService } from './services/procurement-requisition-mechanism.service';
import { ProcurementRequisitionMechanismController } from './controllers/procurement-requisition-mechanism.controller';
import { ProcurementRequisitionDisbursementController } from './controllers/procurement-requisition-disbursement.controller';
import { ProcurementRequisitionDisbursementService } from './services/procurement-requisition-disbursement.service';
import { ProcurementRequisitionTimelineService } from './services/procurement-requisition-timeline.service';
import { ProcurementRequisitionTimelineController } from './controllers/procurement-requisition-timeline.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcurementRequisition,
      ProcurementRequisitionDocument,
      ProcurementRequisitionActivity,
      ProcurementRequisitionItem,
      ProcurementRequisitionDocument,
      ProcurementRequisitionTimeline,
      ProcurementRequisitionOfficerAssignment,
      ProcurementRequisitionItemReference,
      ProcurementRequisitionBudgetLine,
      ProcurementRequisitionMechanism,
      ProcurementRequisitionOfficerAssignment,
      ProcurementRequisitionDisbursement,
      AnnualProcurementPlanActivity,
    ]),
    ClientsModule.register([
      {
        name: 'TENDERING_RMQ_SERVICE',
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
    ProcurementRequisitionActivityService,
    ProcurementRequisitionDocumentService,
    ProcurementRequisitionItemService,
    ProcurementRequisitionItemReferenceService,
    ProcurementRequisitionOfficerAssignmentService,
    ProcurementRequisitionMechanismService,
    ProcurementRequisitionDisbursementService,
    ProcurementRequisitionTimelineService,
  ],
  controllers: [
    ProcurementRequisitionController,
    ProcurementRequisitionDocumentController,
    ProcurementRequisitionActivityController,
    ProcurementRequisitionItemController,
    ProcurementRequisitionOfficerAssignmentController,
    ProcurementRequisitionMechanismController,
    ProcurementRequisitionDisbursementController,
    ProcurementRequisitionTimelineController,
  ],
})
export class ProcurementRequisitionModule {}
