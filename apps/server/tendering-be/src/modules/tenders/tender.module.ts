import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Lot,
  Item,
  ProcurementMechanism,
  ProcurementTechnicalTeam,
  TenderSpd,
  Tender,
} from 'src/entities';
import {
  ItemController,
  LotController,
  ProcurementMechanismController,
  ProcurementTechnicalTeamController,
  TenderSpdController,
  TenderController,
} from './controller';
import {
  ItemService,
  LotService,
  ProcurementMechanismService,
  ProcurementTechnicalTeamService,
  TenderSpdService,
  TenderService,
} from './service';
import { FileHelperService } from '../../shared/min-io/file-helper.service';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { TenderClassification } from 'src/entities/tender-classification.entity';
import { TenderParticipationFee } from 'src/entities/tender-participation-fee.entity';
import { TenderClassificationService } from './service/tender-classification.service';
import { TenderClassificationController } from './controller/tender-classification.controller';
import { TenderParticipationFeeController } from './controller/tender-participation-fee.controller';
import { DocxModule } from 'src/shared/docx/docx.module';
import { TenderParticipationFeeService } from './service/tender-participation-fee.service';
import { DocumentManipulatorModule } from 'src/shared/document-manipulator/document-manipulator.module';

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
  ],
})
export class TenderModule {}
