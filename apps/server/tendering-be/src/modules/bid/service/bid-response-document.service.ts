import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponseTender } from 'src/entities/bid-response-tender.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  GetBidResponseTenderDto,
  UploadBidResponseDocumentDto,
} from '../dto/bid-response.dto';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { EncryptionHelperService } from './encryption-helper.service';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
import { BidResponseDocument } from 'src/entities/bid-response-document.entity';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';

@Injectable()
export class BidResponseDocumentService {
  constructor(
    @InjectRepository(BidResponseDocument)
    private readonly bidSecurityRepository: Repository<BidResponseDocument>,
    private readonly encryptionHelperService: EncryptionHelperService,
    private readonly minIOService: MinIOService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async uploadBidResponseDocument(
    itemData: UploadBidResponseDocumentDto,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          bidRegistration: {
            tenderId: itemData.tenderId,
            bidderId: bidderId,
          },
        },
        relations: {
          bidRegistration: true,
        },
      });
    if (!bidRegistrationDetail) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
      bidRegistrationDetail.bidRegistration,
      itemData.documentType,
      itemData.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const document = await this.minIOService.generatePresignedUploadUrl(
      itemData.value.file,
      BucketNameEnum.BID_FORM_DOCUMENT,
    );

    const encryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify({
        value: {
          ...itemData.value,
          file: document.file,
        },
      }),
      itemData.password,
      bidRegistrationDetail.bidRegistration.salt,
    );

    const item = manager.getRepository(BidResponseDocument).create(itemData);
    item.bidRegistrationDetailId = bidRegistrationDetail.id;
    item.value = encryptedValue;

    await this.bidSecurityRepository.upsert(item, ['bidRegistrationId', 'key']);
    return {
      ...item,
      presignedDownload: document.presignedUrl,
    };
  }

  async getBidResponseDocumentByKey(
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
