import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponse } from 'src/entities/bid-response.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateBidResponseDto,
  GetBidResponseDto,
} from '../dto/bid-response.dto';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { DocumentTypeEnum, EnvelopTypeEnum } from 'src/shared/enums';
import { EncryptionHelperService } from './encryption-helper.service';

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
      bidRegistrationDetail,
      itemData.documentType,
      itemData.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const encryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify(itemData.value),
      itemData.password,
      bidRegistrationDetail.salt,
    );

    const item = this.bidSecurityRepository.create(itemData);
    item.bidRegistrationDetailId = bidRegistrationDetail.id;
    item.value = encryptedValue;
    await this.bidSecurityRepository.insert(item);
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

    const isPasswordValid = this.checkPasswordValidity(
      bidRegistrationDetail,
      itemData.documentType,
      itemData.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }
    const bidResponse = await this.bidSecurityRepository.findOneBy({
      bidRegistrationDetailId: bidRegistrationDetail.id,
      documentType: itemData.documentType,
      key: itemData.key,
    });

    const decryptedValue = this.encryptionHelperService.encryptData(
      bidResponse.value,
      itemData.password,
      bidRegistrationDetail.salt,
    );
    return decryptedValue;
  }

  checkPasswordValidity(
    bidRegistrationDetail: BidRegistrationDetail,
    documentType: string,
    password: string,
  ) {
    const data =
      bidRegistrationDetail.bidRegistration.bidderId +
      bidRegistrationDetail.bidRegistrationId;

    if (documentType == DocumentTypeEnum.RESPONSE) {
      const decrypted = this.encryptionHelperService.decryptedData(
        bidRegistrationDetail.response,
        password,
        bidRegistrationDetail.salt,
      );

      return data == decrypted;
    } else if (documentType == DocumentTypeEnum.FINANCIAL_RESPONSE) {
      const decrypted = this.encryptionHelperService.decryptedData(
        bidRegistrationDetail.financialResponse,
        password,
        bidRegistrationDetail.salt,
      );

      return data == decrypted;
    } else if (documentType == DocumentTypeEnum.TECHNICAL_RESPONSE) {
      const decrypted = this.encryptionHelperService.decryptedData(
        bidRegistrationDetail.technicalResponse,
        password,
        bidRegistrationDetail.salt,
      );

      return data == decrypted;
    }

    throw new BadRequestException('invalid_document_type');
  }
}
