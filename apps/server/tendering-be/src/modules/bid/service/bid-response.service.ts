import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponseLot } from 'src/entities/bid-response-lot.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, In, Repository } from 'typeorm';
import {
  CheckPasswordDto,
  CreateBidResponseDto,
  CreateBidResponseItemDto,
  CreateBidResponseTenderDto,
  GetBidResponseDto,
  GetBidResponseItemDto,
  GetBidResponseTenderDto,
} from '../dto/bid-response.dto';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { DocumentTypeEnum } from 'src/shared/enums';
import { EncryptionHelperService } from './encryption-helper.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { BidResponseTender } from 'src/entities/bid-response-tender.entity';
import { BidResponseItem } from 'src/entities/bid-response-item.entity';
import { Item } from 'src/entities';

@Injectable()
export class BidResponseService extends ExtraCrudService<BidResponseLot> {
  constructor(
    @InjectRepository(BidResponseLot)
    private readonly bidSecurityRepository: Repository<BidResponseLot>,
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

    const isPasswordValid = this.checkPasswordValidity(
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

  async createBidResponseItem(
    itemData: CreateBidResponseItemDto,
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

    const item = manager.getRepository(BidResponseItem).create(itemData);

    item.bidRegistrationDetailId = bidRegistrationDetail.id;
    item.value = encryptedValue;

    await manager
      .getRepository(BidResponseItem)
      .upsert(item, ['bidRegistrationDetailId', 'itemId', 'key']);

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

  async getBidResponseTenderByKey(
    itemData: GetBidResponseTenderDto,
    req?: any,
  ) {
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

    const bidResponse = await manager
      .getRepository(BidResponseTender)
      .findOneBy({
        bidRegistrationId: bidRegistration.id,
        documentType: itemData.documentType,
        key: itemData.key,
      });

    const decryptedValue = this.encryptionHelperService.decryptedData(
      bidResponse.value,
      itemData.password,
      bidRegistration.salt,
    );
    return decryptedValue;
  }

  async getBidResponseItemByKey(itemData: GetBidResponseItemDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidResponseItem = await manager
      .getRepository(BidResponseItem)
      .findOne({
        where: {
          itemId: itemData.itemId,
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
    if (!bidResponseItem) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const bidResponse = await this.bidSecurityRepository.findOneBy({
      bidRegistrationDetailId: bidResponseItem.bidRegistrationDetailId,
      documentType: itemData.documentType,
      key: itemData.key,
    });

    const decryptedValue = this.encryptionHelperService.decryptedData(
      bidResponse.value,
      itemData.password,
      bidResponseItem.bidRegistrationDetail.bidRegistration.salt,
    );

    return decryptedValue;
  }

  async getItems(lotId: string, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: lotId,
          bidRegistration: {
            bidderId: bidderId,
          },
        },
      });
    if (!bidRegistrationDetail) {
      throw new BadRequestException('bid_registration_not_found');
    }

    const itemId = [
      ...(bidRegistrationDetail?.financialItems ?? []),
      ...(bidRegistrationDetail?.technicalItems ?? []),
    ];

    const items = await manager.getRepository(Item).findBy({
      id: In(itemId),
    });

    return items;
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

  private checkPasswordValidity(
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
