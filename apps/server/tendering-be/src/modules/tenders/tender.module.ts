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
import { TenderSpdBidForm } from 'src/entities/tender-spd-bid-form.entity';
import { TenderSpdContractForm } from 'src/entities/tender-spd-contract-form.entity';
import { TenderSpdContractFormService } from './service/tender-spd-contract-form.service';
import { TenderSpdBidFormController } from './controller/tender-spd-bid-form.controller';
import { TenderSpdBidFormService } from './service/tender-spd-bid-form.service';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import { TenderSpdContractFormController } from './controller/tender-spd-contract-form.controller';
import { TenderClassification } from 'src/entities/tender-classification.entity';
import { TenderParticipationFee } from 'src/entities/tender-participation-fee.entity';
import { TenderClassificationService } from './service/tender-classification.service';
import { TenderParticipationFeeService } from './service/tender-participation-fee.service';
import { TenderClassificationController } from './controller/tender-classification.controller';
import { TenderParticipationFeeController } from './controller/tender-participation-fee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      TenderSpd,
      Lot,
      Item,
      ProcurementMechanism,
      ProcurementTechnicalTeam,
      TenderSpdBidForm,
      TenderSpdContractForm,
      TenderClassification,
      TenderParticipationFee,
    ]),
    MinIOModule,
  ],
  controllers: [
    TenderController,
    TenderSpdController,
    ItemController,
    LotController,
    ProcurementMechanismController,
    ProcurementTechnicalTeamController,
    TenderSpdBidFormController,
    TenderSpdContractFormController,
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
    TenderSpdContractFormService,
    TenderSpdBidFormService,
    TenderClassificationService,
    TenderParticipationFeeService,
  ],
})
export class TenderModule {}
