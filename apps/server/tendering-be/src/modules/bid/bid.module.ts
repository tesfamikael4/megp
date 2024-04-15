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
import { DocxModule } from 'src/shared/docx/docx.module';
import { MinIOModule } from 'src/shared/min-io';
import { BidResponseDocument } from 'src/entities/bid-response-document.entity';
import { BidResponseDocumentController } from './controller/bid-response-docuement.controller';
import { BidResponseDocumentService } from './service/bid-response-document.service';
import { BidResponseOpeningService } from './service/bid-response-opening.service';
import { BidResponseOpeningController } from './controller/bid-response-opening.controller';
import { OpenedBidResponseItem } from 'src/entities/opened-bid-response-item.entity';
import { OpenedBidResponseLot } from 'src/entities/opened-bid-response-lot.entity';
import { OpenedBidResponseTender } from 'src/entities/opened-bid-response-tender.entity';

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
      BidResponseDocument,
      OpenedBidResponseItem,
      OpenedBidResponseLot,
      OpenedBidResponseTender,
    ]),
    AuthorizationModule,
    DocxModule,
    MinIOModule,
  ],
  controllers: [
    BidBookmarkController,
    BidRegistrationController,
    BidResponseController,
    BidResponseItemController,
    BidResponseTenderController,
    BidResponseDocumentController,
    BidResponseOpeningController,
    BidGuaranteeController,
  ],
  providers: [
    BidBookmarkService,
    BidRegistrationService,
    BidResponseService,
    EncryptionHelperService,
    BidResponseItemService,
    BidResponseTenderService,
    BidResponseDocumentService,
    BidResponseOpeningService,
    BidGuaranteeService,
  ],
  exports: [BidRegistrationService],
})
export class BidModule {}
