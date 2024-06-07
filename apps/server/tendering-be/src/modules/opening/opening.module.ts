import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BidOpeningChecklistAssessmentDetail,
  BidOpeningMinute,
  Opening,
  SharedBidderKey,
} from 'src/entities';
import { OpeningService } from './service/opening.service';
import { BidOpeningChecklistAssessmentDetailService } from './service/bid-opening-checklist-assessment-detail.service';
import { BidOpeningMinuteService } from './service/bid-opening-minute.service';
import { SharedBidderKeyService } from './service/shared-bidder-key.service';
import { BidOpeningChecklistAssessmentDetailController } from './controller/bid-opening-checklist-assessment-detail.controller';
import { BidOpeningMinuteController } from './controller/bid-opening-minute.controller';
import { OpeningController } from './controller/opening.controller';
import { SharedBidderKeyController } from './controller/shared-bidder-key.controller';
import { BidModule } from '../bid/bid.module';
import { BidOpeningChecklistAssessmentController } from './controller/bid-opening-checklist-assessment.controller';
import { BidOpeningChecklistAssessment } from 'src/entities/bid-opening-checklist-assessment.entity';
import { BidOpeningChecklistAssessmentService } from './service/bid-opening-checklist-assessment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Opening,
      BidOpeningChecklistAssessmentDetail,
      BidOpeningChecklistAssessment,
      BidOpeningMinute,
      SharedBidderKey,
    ]),
    BidModule,
  ],
  providers: [
    OpeningService,
    BidOpeningChecklistAssessmentDetailService,
    BidOpeningChecklistAssessmentService,
    BidOpeningMinuteService,
    SharedBidderKeyService,
  ],
  controllers: [
    OpeningController,
    BidOpeningChecklistAssessmentDetailController,
    BidOpeningChecklistAssessmentController,
    BidOpeningMinuteController,
    SharedBidderKeyController,
  ],
})
export class OpeningModule {}
