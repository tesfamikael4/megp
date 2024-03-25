import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponse } from 'src/entities/bid-response.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import {
  CheckPasswordDto,
  CreateBidResponseDto,
  GetBidResponseDto,
} from '../dto/bid-response.dto';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { DocumentTypeEnum } from 'src/shared/enums';
import { EncryptionHelperService } from './encryption-helper.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';

@Injectable()
export class BidResponseService extends ExtraCrudService<BidResponse> {
  constructor(
    @InjectRepository(BidResponse)
    private readonly bidSecurityRepository: Repository<BidResponse>,
    private readonly encryptionHelperService: EncryptionHelperService,
    @Inject(REQUEST) private request: Request,
  ) {
    super(bidSecurityRepository);
  }

  async create(itemData: CreateBidResponseDto, req?: any): Promise<any> {
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

    const isPasswordValid = this.checkPasswordValidity(
      bidRegistrationDetail.bidRegistration,
      itemData.documentType,
      itemData.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const encryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify(itemData.value),
      itemData.password,
      bidRegistrationDetail.bidRegistration.salt,
    );

    const item = this.bidSecurityRepository.create(itemData);
    item.bidRegistrationDetailId = bidRegistrationDetail.id;
    item.value = encryptedValue;
    await this.bidSecurityRepository.upsert(item, [
      'bidRegistrationDetailId',
      'key',
    ]);
    return item;
  }

  async getBidResponseByKey(itemData: GetBidResponseDto, req?: any) {
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

    const bidResponse = await this.bidSecurityRepository.findOneBy({
      bidRegistrationDetailId: bidRegistrationDetail.id,
      documentType: itemData.documentType,
      key: itemData.key,
    });

    const decryptedValue = this.encryptionHelperService.decryptedData(
      bidResponse.value,
      itemData.password,
      bidRegistrationDetail.bidRegistration.salt,
    );
    return decryptedValue;
  }

  async checkPassword(itemData: CheckPasswordDto, req?: any) {
    try {
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

      const decryptedValue = this.checkPasswordValidity(
        bidRegistration,
        itemData.documentType,
        itemData.password,
      );

      return decryptedValue;
    } catch (error) {
      if (error?.message == 'invalid_password') {
        return false;
      }

      throw error;
    }
  }

  checkPasswordValidity(
    bidRegistration: BidRegistration,
    documentType: string,
    password: string,
  ) {
    const data = bidRegistration.bidderId + bidRegistration.id;

    if (documentType == DocumentTypeEnum.RESPONSE) {
      const decrypted = this.encryptionHelperService.decryptedData(
        bidRegistration.response,
        password,
        bidRegistration.salt,
      );

      return data == decrypted;
    } else if (documentType == DocumentTypeEnum.FINANCIAL_RESPONSE) {
      const decrypted = this.encryptionHelperService.decryptedData(
        bidRegistration.financialResponse,
        password,
        bidRegistration.salt,
      );

      return data == decrypted;
    } else if (documentType == DocumentTypeEnum.TECHNICAL_RESPONSE) {
      const decrypted = this.encryptionHelperService.decryptedData(
        bidRegistration.technicalResponse,
        password,
        bidRegistration.salt,
      );

      return data == decrypted;
    }

    throw new BadRequestException('invalid_document_type');
  }
}
