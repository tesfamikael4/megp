import { Module } from '@nestjs/common';
import { SolRegistrationController } from './controllers/registration.controller';
import { SolRegistrationService } from './services/registration.service';
import {
  OpenedItemResponse,
  OpenedOffer,
  OpenedResponse,
  RFX,
  RFXItem,
  SolBookmark,
  SolItemResponse,
  SolOffer,
  SolRegistration,
  SolResponse,
  SolRound,
  SolRoundAward,
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
import { OpenerService } from '../evaluation/services/opener.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { SolRoundAwardController } from './controllers/round-award.controller';
import { SolRoundAwardService } from './services/round-award.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolBookmark,
      SolRegistration,
      SolRound,
      SolOffer,
      SolResponse,
      SolItemResponse,
      SolRoundAward,
      RFX,
      RFXItem,
      OpenedOffer,
      OpenedResponse,
      OpenedItemResponse,
    ]),
    MinIOModule,
    UtilityModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'rms',
          type: 'direct',
        },
      ],
      uri: process.env.RMQ_URL,
      enableControllerDiscovery: true,
    }),
  ],
  controllers: [
    SolBookmarkController,
    SolRegistrationController,
    SolRoundController,
    SolOfferController,
    SolItemResponseController,
    SolResponseController,
    SolRoundAwardController,
  ],
  providers: [
    SolBookmarkService,
    SolRegistrationService,
    SolOfferService,
    SolRoundService,
    SolItemResponseService,
    SolResponseService,
    EncryptionHelperService,
    OpenerService,
    SolRoundAwardService,
  ],
  exports: [SolRoundService],
})
export class SolicitationModule {}
