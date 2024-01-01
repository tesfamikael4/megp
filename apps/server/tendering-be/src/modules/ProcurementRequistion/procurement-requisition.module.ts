import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementRequisitionController } from './controllers/procurement-requisition.controller';
import { ProcurementRequisitionService } from './services/procurement-requisition.service';
import {
  ProcurementRequisition,
  ProcurementRequisitionActivity,
  ProcurementRequisitionBudgetLine,
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
    ]),
  ],
  providers: [
    ProcurementRequisitionService,
    ProcurementRequisitionActivityService,
    ProcurementRequisitionDocumentService,
    ProcurementRequisitionItemService,
    ProcurementRequisitionDocumentService,
    ProcurementRequisitionItemReferenceService,
    ProcurementRequisitionOfficerAssignmentService,
  ],
  controllers: [
    ProcurementRequisitionController,
    ProcurementRequisitionDocumentController,
    ProcurementRequisitionActivityController,
    ProcurementRequisitionItemController,
    ProcurementRequisitionDocumentController,
    ProcurementRequisitionOfficerAssignmentController,
  ],
})
export class ProcurementRequisitionModule {}
