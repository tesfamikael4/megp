import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BidOpeningChecklist,
  BidOpeningMinute,
  Opening,
  SharedBidderKey,
} from 'src/entities';
import { OpeningService } from './service/opening.service';
import { BidOpeningChecklistService } from './service/bid-opening-checklist.service';
import { BidOpeningMinuteService } from './service/bid-opening-minute.service';
import { SharedBidderKeyService } from './service/shared-bidder-key.service';
import { BidOpeningChecklistController } from './controller/bid-opening-checklist.controller';
import { BidOpeningMinuteController } from './controller/bid-opening-minute.controller';
import { OpeningController } from './controller/opening.controller';
import { SharedBidderKeyController } from './controller/shared-bidder-key.controller';
import { BidModule } from '../bid/bid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Opening,
      BidOpeningChecklist,
      BidOpeningMinute,
      SharedBidderKey,
    ]),
    BidModule,
  ],
  providers: [
    OpeningService,
    BidOpeningChecklistService,
    BidOpeningMinuteService,
    SharedBidderKeyService,
  ],
  controllers: [
    OpeningController,
    BidOpeningChecklistController,
    BidOpeningMinuteController,
    SharedBidderKeyController,
  ],
})
export class OpeningModule {}
