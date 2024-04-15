import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';
import { OpenBidResponseDto } from '../dto/bid-response.dto';
import { BidResponseItem } from 'src/entities/bid-response-item.entity';
import { EncryptionHelperService } from './encryption-helper.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { BidResponseTender } from 'src/entities/bid-response-tender.entity';
import { BidResponseLot } from 'src/entities/bid-response-lot.entity';
import { BidResponseDocument } from 'src/entities/bid-response-document.entity';
import { OpenedBidResponseItem } from 'src/entities/opened-bid-response-item.entity';
import { OpenedBidResponseTender } from 'src/entities/opened-bid-response-tender.entity';
import { OpenedBidResponseLot } from 'src/entities/opened-bid-response-lot.entity';

@Injectable()
export class BidResponseOpeningService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly encryptionHelperService: EncryptionHelperService,
  ) {}

  async openBidResponse(payload: OpenBidResponseDto) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const bidRegistration = await manager
      .getRepository(BidRegistration)
      .findOne({
        where: {
          bidderId: payload.bidderId,
          tenderId: payload.tenderId,
        },
      });

    const openedBidResponseItems: OpenedBidResponseItem[] = [];
    const bidResponseItems = await manager
      .getRepository(BidResponseItem)
      .findBy({
        documentType: payload.documentType,
        bidRegistrationDetail: {
          bidRegistrationId: bidRegistration.id,
        },
      });

    for (const bidResponseItem of bidResponseItems) {
      const decryptedValue = this.encryptionHelperService.decryptedData(
        bidResponseItem.value,
        payload.password,
        bidRegistration.salt,
      );

      openedBidResponseItems.push(
        manager.getRepository(OpenedBidResponseItem).create({
          ...bidResponseItem,
          id: undefined,
          value: JSON.parse(decryptedValue),
        }),
      );
    }

    const openedBidResponseTenders: OpenedBidResponseTender[] = [];
    const bidResponseTenders = await manager
      .getRepository(BidResponseTender)
      .findBy({
        documentType: payload.documentType,
        bidRegistrationId: bidRegistration.id,
      });
    for (const bidResponseTender of bidResponseTenders) {
      const decryptedValue = this.encryptionHelperService.decryptedData(
        bidResponseTender.value,
        payload.password,
        bidRegistration.salt,
      );

      openedBidResponseTenders.push(
        manager.getRepository(OpenedBidResponseTender).create({
          ...bidResponseTender,
          id: undefined,
          value: JSON.parse(decryptedValue),
        }),
      );
    }

    const openedBidResponseLots: OpenedBidResponseLot[] = [];
    const bidResponseLots = await manager.getRepository(BidResponseLot).findBy({
      documentType: payload.documentType,
      bidRegistrationDetail: {
        bidRegistrationId: bidRegistration.id,
      },
    });
    for (const bidResponseLot of bidResponseLots) {
      const decryptedValue = this.encryptionHelperService.decryptedData(
        bidResponseLot.value,
        payload.password,
        bidRegistration.salt,
      );

      openedBidResponseLots.push(
        manager.getRepository(OpenedBidResponseLot).create({
          ...bidResponseLot,
          id: undefined,
          value: JSON.parse(decryptedValue),
        }),
      );
    }

    const openedBidResponseDocuments = [];
    const bidResponseDocuments = await manager
      .getRepository(BidResponseDocument)
      .findBy({
        documentType: payload.documentType,
        bidRegistrationDetail: {
          bidRegistrationId: bidRegistration.id,
        },
      });
    for (const bidResponseDocument of bidResponseDocuments) {
      const decryptedValue = this.encryptionHelperService.decryptedData(
        bidResponseDocument.value,
        payload.password,
        bidRegistration.salt,
      );

      openedBidResponseDocuments.push({
        ...bidResponseDocument,
        id: null,
        value: JSON.parse(decryptedValue),
      });
    }

    await manager
      .getRepository(OpenedBidResponseItem)
      .upsert(openedBidResponseItems, [
        'bidRegistrationDetailId',
        'itemId',
        'key',
      ]);
    await manager
      .getRepository(OpenedBidResponseLot)
      .upsert(openedBidResponseLots, ['bidRegistrationDetailId', 'key']);
    await manager
      .getRepository(OpenedBidResponseTender)
      .upsert(openedBidResponseTenders, ['bidRegistrationId', 'key']);

    return {
      openedBidResponseItems,
      openedBidResponseLots,
      openedBidResponseTenders,
      openedBidResponseDocuments,
    };
  }
}
