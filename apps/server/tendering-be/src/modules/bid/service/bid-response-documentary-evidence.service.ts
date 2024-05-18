import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  BidResponseDocumentaryEvidenceDto,
  UploadBidResponseDocumentaryEvidenceDto,
} from '../dto/bid-response.dto';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { EncryptionHelperService } from './encryption-helper.service';
import { BucketNameEnum, MinIOService } from 'src/shared/min-io';
import { BidResponseDocumentaryEvidence } from 'src/entities/bid-response-documentary-evidence.entity';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';

@Injectable()
export class BidResponseDocumentaryEvidenceService {
  constructor(
    @InjectRepository(BidResponseDocumentaryEvidence)
    private readonly bidSecurityRepository: Repository<BidResponseDocumentaryEvidence>,
    private readonly encryptionHelperService: EncryptionHelperService,
    private readonly minIOService: MinIOService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async uploadBidResponseDocumentaryEvidence(
    itemData: UploadBidResponseDocumentaryEvidenceDto,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: itemData.lotId,
          bidRegistration: {
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
      itemData.value,
      BucketNameEnum.BID_FORM_DOCUMENT,
    );

    const encryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify({
        value: document.file,
      }),
      itemData.password,
      bidRegistrationDetail.bidRegistration.salt,
    );

    const item = manager
      .getRepository(BidResponseDocumentaryEvidence)
      .create(itemData);
    item.bidRegistrationDetailId = bidRegistrationDetail.id;
    item.value = encryptedValue;

    await this.bidSecurityRepository.upsert(item, [
      'bidRegistrationDetailId',
      'eqcDocumentaryEvidenceId',
    ]);
    return {
      ...item,
      presignedDownload: document.presignedUrl,
    };
  }

  async getBidResponseDocumentaryEvidence(
    itemData: BidResponseDocumentaryEvidenceDto,
    req?: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidResponseDocumentaryEvidences = await manager
      .getRepository(BidResponseDocumentaryEvidence)
      .find({
        where: {
          documentType: itemData.documentType,
          bidRegistrationDetail: {
            lotId: itemData.lotId,
            bidRegistration: {
              bidderId: bidderId,
            },
          },
        },
        relations: {
          bidRegistrationDetail: {
            bidRegistration: true,
          },
        },
      });

    return bidResponseDocumentaryEvidences;
  }
}
