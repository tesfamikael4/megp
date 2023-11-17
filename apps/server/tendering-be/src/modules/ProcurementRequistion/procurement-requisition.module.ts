import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementRequisitionController } from './controllers/procurement-requisition.controller';
import { ProcurementRequisitionService } from './services/procurement-requisition.service';
import {
  ProcurementRequisition,
  ProcurementRequisitionActivity,
  ProcurementRequisitionAttachment,
} from 'src/entities';
import { ProcurementRequisitionActivityController } from './controllers/procurement-requisition-activity';
import { ProcurementRequisitionAttachmentController } from './controllers/procurement-requisition-attachment';
import { ProcurementRequisitionActivityService } from './services/procurement-requisition-activity.service copy';
import { ProcurementRequisitionAttachmentService } from './services/procurement-requisition-attachment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProcurementRequisition,
      ProcurementRequisitionAttachment,
      ProcurementRequisitionActivity,
    ]),
  ],
  providers: [
    ProcurementRequisitionService,
    ProcurementRequisitionActivityService,
    ProcurementRequisitionAttachmentService,
  ],
  controllers: [
    ProcurementRequisitionController,
    ProcurementRequisitionAttachmentController,
    ProcurementRequisitionActivityController,
  ],
})
export class ProcurementRequisitionModule {}
