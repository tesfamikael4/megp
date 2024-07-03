import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHelperService } from '../../shared/document-manipulator/file-helper.service';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { DocxModule } from 'src/shared/docx/docx.module';
import { DocumentManipulatorModule } from 'src/shared/document-manipulator/document-manipulator.module';
import {
  Lot,
  Item,
  Note,
  ProcurementMechanism,
  ProcurementTechnicalTeam,
  RevisionApproval,
  TenderClassification,
  TenderParticipationFee,
  TenderPersonal,
  TenderSpd,
  Tender,
} from 'src/entities';
import {
  ItemController,
  LotController,
  NoteController,
  ProcurementMechanismController,
  ProcurementTechnicalTeamController,
  RevisionApprovalController,
  TenderClassificationController,
  TenderParticipationFeeController,
  TenderPersonalController,
  TenderSpdController,
  TenderController,
} from './controller';
import {
  ItemService,
  LotService,
  NoteService,
  ProcurementMechanismService,
  ProcurementTechnicalTeamService,
  RevisionApprovalService,
  TenderClassificationService,
  TenderParticipationFeeService,
  TenderPersonalService,
  TenderSpdService,
  TenderService,
} from './service';
import { TenderApprovalService } from './service/tender-approval.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      TenderSpd,
      Lot,
      Item,
      Note,
      ProcurementMechanism,
      ProcurementTechnicalTeam,
      RevisionApproval,
      TenderClassification,
      TenderParticipationFee,
      TenderPersonal,
    ]),
    MinIOModule,
    DocxModule,
    DocumentManipulatorModule,
    ClientsModule.register([
      {
        name: 'WORKFLOW_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'workflow-initiate',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ERROR_LOG_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'error-log',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'RMS_RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'rms',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [
    TenderController,
    TenderSpdController,
    ItemController,
    LotController,
    NoteController,
    ProcurementMechanismController,
    ProcurementTechnicalTeamController,
    RevisionApprovalController,
    TenderClassificationController,
    TenderParticipationFeeController,
    TenderPersonalController,
  ],
  providers: [
    TenderSpdService,
    TenderService,
    ItemService,
    LotService,
    NoteService,
    ProcurementMechanismService,
    ProcurementTechnicalTeamService,
    FileHelperService,
    RevisionApprovalService,
    TenderClassificationService,
    TenderParticipationFeeService,
    TenderPersonalService,
    TenderApprovalService,
  ],
})
export class TenderModule {}
