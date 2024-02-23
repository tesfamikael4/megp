import { TenderService } from './service/tender.service';
import { TenderController } from './controller/tender.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Lot,
  ProcurementMechanism,
  ProcurementTechnicalTeam,
  Tender,
} from 'src/entities';
// import { Item } from 'src/entities/item.entity';
// import { ItemController } from './controller/item.controller';
import { LotController } from './controller/lot.controller';
import { ProcurementMechanismController } from './controller/procurement-mechanism.controller';
import { ProcurementTechnicalTeamController } from './controller/procurement-technincal-team.controller';
// import { ItemService } from './service/item.service';
import { LotService } from './service/lot.service';
import { ProcurementMechanismService } from './service/procurement-mechanism.service';
import { ProcurementTechnicalTeamService } from './service/procurement-technical-team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      Lot,
      // Item,
      ProcurementMechanism,
      ProcurementTechnicalTeam,
    ]),
  ],
  controllers: [
    TenderController,
    // ItemController,
    LotController,
    ProcurementMechanismController,
    ProcurementTechnicalTeamController,
  ],
  providers: [
    TenderService,
    // ItemService,
    LotService,
    ProcurementMechanismService,
    ProcurementTechnicalTeamService,
  ],
})
export class TenderModule {}
