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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      TenderSpd,
      Lot,
      Item,
      ProcurementMechanism,
      ProcurementTechnicalTeam,
    ]),
  ],
  controllers: [
    TenderController,
    TenderSpdController,
    ItemController,
    LotController,
    ProcurementMechanismController,
    ProcurementTechnicalTeamController,
  ],
  providers: [
    TenderSpdService,
    TenderService,
    ItemService,
    LotService,
    ProcurementMechanismService,
    ProcurementTechnicalTeamService,
  ],
})
export class TenderModule {}
