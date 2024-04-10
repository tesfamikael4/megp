import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BidOpeningChecklist,
  BidOpeningMinute,
  BidSecurity,
  Opening,
  SharedBidderKey,
} from 'src/entities';
import { OpeningService } from './service/opening.service';
import { BidOpeningChecklistService } from './service/bid-opening-checklist.service';
import { BidOpeningMinuteService } from './service/bid-opening-minute.service';
import { BidSecurityService } from './service/bid-security.service';
import { SharedBidderKeyService } from './service/shared-bidder-key.service';
import { BidOpeningChecklistController } from './controller/bid-opening-checklist.controller';
import { BidOpeningMinuteController } from './controller/bid-opening-minute.controller';
import { BidSecurityController } from './controller/bid-security.controller';
import { OpeningController } from './controller/opening.controller';
import { SharedBidderKeyController } from './controller/shared-bidder-key.controller';
import { BidRegistrationService } from '../bid/service/bid-registration.service';
import { BidModule } from '../bid/bid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Opening,
      BidOpeningChecklist,
      BidOpeningMinute,
      BidSecurity,
      SharedBidderKey,
    ]),
    BidModule,
  ],
  providers: [
    OpeningService,
    BidOpeningChecklistService,
    BidOpeningMinuteService,
    BidSecurityService,
    SharedBidderKeyService,
    // BidRegistrationService
  ],
  controllers: [
    OpeningController,
    BidOpeningChecklistController,
    BidOpeningMinuteController,
    BidSecurityController,
    SharedBidderKeyController,
  ],
})
export class OpeningModule {}
