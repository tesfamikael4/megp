import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponseTender } from 'src/entities/bid-response-tender.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateBidResponseTenderDto,
  GetBidResponseTenderDto,
  UploadBidResponseTenderDto,
} from '../dto/bid-response.dto';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { EncryptionHelperService } from './encryption-helper.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { MinIOService } from 'src/shared/min-io';

@Injectable()
export class BidResponseTenderService {
  constructor(
    @InjectRepository(BidResponseTender)
    private readonly bidSecurityRepository: Repository<BidResponseTender>,
    private readonly encryptionHelperService: EncryptionHelperService,
    private readonly minIOService: MinIOService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createBidResponseTender(
    itemData: CreateBidResponseTenderDto,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistration = await manager
      .getRepository(BidRegistration)
      .findOne({
        where: {
          tenderId: itemData.tenderId,
          bidderId: bidderId,
        },
      });
    if (!bidRegistration) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
      bidRegistration,
      itemData.documentType,
      itemData.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const encryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify(itemData.value),
      itemData.password,
      bidRegistration.salt,
    );

    const item = manager.getRepository(BidResponseTender).create(itemData);
    item.bidRegistrationId = bidRegistration.id;
    item.value = encryptedValue;

    await this.bidSecurityRepository.upsert(item, ['bidRegistrationId', 'key']);
    return item;
  }

  async uploadBidResponseTender(
    itemData: UploadBidResponseTenderDto,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistration = await manager
      .getRepository(BidRegistration)
      .findOne({
        where: {
          tenderId: itemData.tenderId,
          bidderId: bidderId,
        },
      });
    if (!bidRegistration) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
      bidRegistration,
      itemData.documentType,
      itemData.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const document = await this.minIOService.generatePresignedUploadUrl(
      itemData.value,
    );

    const encryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify({
        value: document.file,
      }),
      itemData.password,
      bidRegistration.salt,
    );

    const item = manager.getRepository(BidResponseTender).create(itemData);
    item.bidRegistrationId = bidRegistration.id;
    item.value = encryptedValue;

    await this.bidSecurityRepository.upsert(item, ['bidRegistrationId', 'key']);
    return {
      ...item,
      presignedDownload: document.presignedUrl,
    };
  }

  async getBidResponseTenderByKey(
    itemData: GetBidResponseTenderDto,
    req?: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidResponse = await manager.getRepository(BidResponseTender).findOne({
      where: {
        documentType: itemData.documentType,
        key: itemData.key,
        bidRegistration: {
          tenderId: itemData.tenderId,
          bidderId: bidderId,
        },
      },
      relations: {
        bidRegistration: true,
      },
    });
    if (!bidResponse) {
      throw new BadRequestException('bid_response_not_found');
    }
    const decryptedValue = this.encryptionHelperService.decryptedData(
      bidResponse.value,
      itemData.password,
      bidResponse.bidRegistration.salt,
    );
    return decryptedValue;
  }
}
