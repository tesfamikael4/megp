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
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { TenderApprovalService } from './service/tender-approval.service';

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
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'workflow-broadcast-exchanges',
          type: 'direct',
        },
      ],
      uri: process.env.RMQ_URL,
      enableControllerDiscovery: true,
    }),
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
