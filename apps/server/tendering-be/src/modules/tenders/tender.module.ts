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
  ],
})
export class TenderModule {}
