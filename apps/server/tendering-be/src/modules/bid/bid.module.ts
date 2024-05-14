import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
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
  BidGuaranteeForfeit,
  BidGuaranteeRelease,
  BidGuaranteeExtension,
  BidGuaranteeCancellation,
} from 'src/entities';

// Controllers
import {
  BidBookmarkController,
  BidGuaranteeController,
  BidGuaranteeForfeitController,
  BidGuaranteeReleaseController,
  BidGuaranteeExtensionController,
  BidGuaranteeCancellationController,
  BidResponseDocumentController,
  BidResponseOpeningController,
  BidRegistrationController,
  BidResponseItemController,
  BidResponseTenderController,
  BidResponseController,
} from './controller';

// Services
import {
  BidBookmarkService,
  BidRegistrationService,
  BidGuaranteeService,
  BidGuaranteeForfeitService,
  BidGuaranteeReleaseService,
  BidGuaranteeExtensionService,
  BidGuaranteeCancellationService,
  BidResponseItemService,
  BidResponseTenderService,
  BidResponseDocumentService,
  BidResponseOpeningService,
  BidResponseService,
} from './service';
import { EncryptionHelperService } from './service/encryption-helper.service';

// Shared modules
import { AuthorizationModule } from 'src/shared/authorization';
import { DocxModule } from 'src/shared/docx/docx.module';
import { MinIOModule } from 'src/shared/min-io';
import { BidResponseDocumentaryEvidence } from 'src/entities/bid-response-documentary-evidence.entity';
import { BidResponseDocumentaryEvidenceService } from './service/bid-response-documentary-evidence.service';
import { BidResponseDocumentaryEvidenceController } from './controller/bid-response-documentary-evidence.controller';
import { DocumentManipulatorModule } from 'src/shared/document-manipulator/document-manipulator.module';

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
      BidResponseDocumentaryEvidence,
      OpenedBidResponseItem,
      OpenedBidResponseLot,
      OpenedBidResponseTender,
      BidGuaranteeForfeit,
      BidGuaranteeRelease,
      BidGuaranteeExtension,
      BidGuaranteeCancellation,
    ]),
    AuthorizationModule,
    DocxModule,
    MinIOModule,
    DocumentManipulatorModule,
  ],
  controllers: [
    BidBookmarkController,
    BidRegistrationController,
    BidResponseController,
    BidResponseItemController,
    BidResponseTenderController,
    BidResponseDocumentController,
    BidResponseDocumentaryEvidenceController,
    BidResponseOpeningController,
    BidGuaranteeController,
    BidGuaranteeForfeitController,
    BidGuaranteeReleaseController,
    BidGuaranteeExtensionController,
    BidGuaranteeCancellationController,
  ],
  providers: [
    BidBookmarkService,
    BidRegistrationService,
    BidResponseService,
    EncryptionHelperService,
    BidResponseItemService,
    BidResponseTenderService,
    BidResponseDocumentService,
    BidResponseDocumentaryEvidenceService,
    BidResponseOpeningService,
    BidGuaranteeService,
    BidGuaranteeForfeitService,
    BidGuaranteeReleaseService,
    BidGuaranteeExtensionService,
    BidGuaranteeCancellationService,
  ],
  exports: [BidRegistrationService],
})
export class BidModule {}
