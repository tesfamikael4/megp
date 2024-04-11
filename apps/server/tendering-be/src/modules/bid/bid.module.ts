import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { BidBookmarkController } from './controller/bid-bookmark.controller';
import { BidBookmarkService } from './service/bid-bookmark.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { BidRegistrationService } from './service/bid-registration.service';
import { BidRegistrationController } from './controller/bid-registration.controller';
import { BidResponseLot } from 'src/entities/bid-response-lot.entity';
import { BidResponseService } from './service/bid-response.service';
import { BidResponseController } from './controller/bid-response.controller';
import { EncryptionHelperService } from './service/encryption-helper.service';
import { AuthorizationModule } from 'src/shared/authorization';
import { BidResponseTender } from 'src/entities/bid-response-tender.entity';
import { BidResponseItem } from 'src/entities/bid-response-item.entity';
import { BidResponseItemController } from './controller/bid-response-item.controller';
import { BidResponseTenderController } from './controller/bid-response-tender.controller';
import { BidResponseItemService } from './service/bid-response-item.service';
import { BidResponseTenderService } from './service/bid-response-tender.service';
import { BidGuaranteeController } from './controller/bid-guarantee.controller';
import { BidGuaranteeService } from './service/bid-guarantee.service';
import { BidGuarantee } from 'src/entities/bid-guarantee.entity';
import { Lot } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BidBookmark,
      BidRegistration,
      BidRegistrationDetail,
      BidResponseLot,
      BidResponseTender,
      BidResponseItem,
      Lot,
      BidGuarantee,
    ]),
    AuthorizationModule,
  ],
  controllers: [
    BidBookmarkController,
    BidRegistrationController,
    BidResponseController,
    BidResponseItemController,
    BidResponseTenderController,
    BidGuaranteeController,
  ],
  providers: [
    BidBookmarkService,
    BidRegistrationService,
    BidResponseService,
    EncryptionHelperService,
    BidResponseItemService,
    BidResponseTenderService,
    BidGuaranteeService,
  ],
  exports: [BidRegistrationService],
})
export class BidModule {}
