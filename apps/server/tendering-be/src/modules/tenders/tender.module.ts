import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHelperService } from '../../shared/document-manipulator/file-helper.service';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { DocxModule } from 'src/shared/docx/docx.module';
import { DocumentManipulatorModule } from 'src/shared/document-manipulator/document-manipulator.module';
import {
  Lot,
  Item,
  ProcurementMechanism,
  ProcurementTechnicalTeam,
  TenderClassification,
  TenderParticipationFee,
  TenderPersonal,
  TenderSpd,
  Tender,
} from 'src/entities';
import {
  ItemController,
  LotController,
  ProcurementMechanismController,
  ProcurementTechnicalTeamController,
  TenderClassificationController,
  TenderParticipationFeeController,
  TenderPersonalController,
  TenderSpdController,
  TenderController,
} from './controller';
import {
  ItemService,
  LotService,
  ProcurementMechanismService,
  ProcurementTechnicalTeamService,
  TenderClassificationService,
  TenderParticipationFeeService,
  TenderPersonalService,
  TenderSpdService,
  TenderService,
} from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      TenderSpd,
      Lot,
      Item,
      ProcurementMechanism,
      ProcurementTechnicalTeam,
      TenderClassification,
      TenderParticipationFee,
      TenderPersonal,
    ]),
    MinIOModule,
    DocxModule,
    DocumentManipulatorModule,
  ],
  controllers: [
    TenderController,
    TenderSpdController,
    ItemController,
    LotController,
    ProcurementMechanismController,
    ProcurementTechnicalTeamController,
    TenderClassificationController,
    TenderParticipationFeeController,
    TenderPersonalController,
  ],
  providers: [
    TenderSpdService,
    TenderService,
    ItemService,
    LotService,
    ProcurementMechanismService,
    ProcurementTechnicalTeamService,
    FileHelperService,
    TenderClassificationService,
    TenderParticipationFeeService,
    TenderPersonalService,
  ],
})
export class TenderModule {}
