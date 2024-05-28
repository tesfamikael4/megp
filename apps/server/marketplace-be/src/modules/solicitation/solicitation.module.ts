import { Module } from '@nestjs/common';
import { SolRegistrationController } from './controllers/registration.controller';
import { SolRegistrationService } from './services/registration.service';
import {
  OpenedItemResponse,
  OpenedResponse,
  RFX,
  RFXItem,
  SolBookmark,
  SolItemResponse,
  SolOffer,
  SolRegistration,
  SolResponse,
  SolRound,
} from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolRoundService } from './services/round.service';
import { SolRoundController } from './controllers/round.controller';
import { SolOfferController } from './controllers/offer.controller';
import { SolOfferService } from './services/offer.service';
import { SolItemResponseController } from './controllers/item-response.controller';
import { SolItemResponseService } from './services/item-response.service';
import { EncryptionHelperService } from '../../utils/services/encryption-helper.service';
import { SolBookmarkController } from './controllers/bookmark.controller';
import { SolBookmarkService } from './services/bookmark.service';
import { SolResponseController } from './controllers/response.controller';
import { SolResponseService } from './services/response.service';
import { MinIOModule } from 'megp-shared-be';
import { UtilityModule } from 'src/utils/utils.module';
import { OpenerSerivice } from '../evaluation/services/opener.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolBookmark,
      SolRegistration,
      SolRound,
      SolOffer,
      SolResponse,
      SolItemResponse,
      RFX,
      RFXItem,
      OpenedResponse,
      OpenedItemResponse,
    ]),
    MinIOModule,
    UtilityModule,
  ],
  controllers: [
    SolBookmarkController,
    SolRegistrationController,
    SolRoundController,
    SolOfferController,
    SolItemResponseController,
    SolResponseController,
  ],
  providers: [
    SolBookmarkService,
    SolRegistrationService,
    SolOfferService,
    SolRoundService,
    SolItemResponseService,
    SolResponseService,
    EncryptionHelperService,
    OpenerSerivice,
  ],
  exports: [SolRoundService],
})
export class SolicitationModule {}
