import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';
import { OpenBidResponseDto } from '../dto/bid-response.dto';
import { BidResponseItem } from 'src/entities/bid-response-item.entity';
import { EncryptionHelperService } from './encryption-helper.service';

@Injectable()
export class BidResponseOpeningService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly encryptionHelperService: EncryptionHelperService,
  ) {}

  async openBidResponse(payload: OpenBidResponseDto, req: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidResponseItems = await manager
      .getRepository(BidResponseItem)
      .findBy({
        documentType: payload.documentType,
        bidRegistrationDetail: {
          bidRegistration: {
            bidderId: bidderId,
            tenderId: payload.tenderId,
          },
        },
      });

    const openedBidResponseItems = [];

    for (const bidResponseItem of bidResponseItems) {
      const decryptedValue = this.encryptionHelperService.decryptedData(
        bidResponseItem.value,
        payload.password,
        bidResponseItem.bidRegistrationDetail.bidRegistration.salt,
      );

      openedBidResponseItems.push({
        ...bidResponseItem,
        id: null,
        value: decryptedValue,
      });
    }
  }
}
