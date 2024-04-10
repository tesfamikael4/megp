import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponseLot } from 'src/entities/bid-response-lot.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager, Repository } from 'typeorm';
import {
  CheckPasswordDto,
  CreateBidResponseDto,
  GetBidResponseDto,
} from '../dto/bid-response.dto';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { EncryptionHelperService } from './encryption-helper.service';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { Item } from 'src/entities';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class BidResponseService {
  constructor(
    @InjectRepository(BidResponseLot)
    private readonly bidSecurityRepository: Repository<BidResponseLot>,
    private readonly encryptionHelperService: EncryptionHelperService,
    @Inject(REQUEST) private request: Request,
  ) {}

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

    const isPasswordValid = this.encryptionHelperService.checkPasswordValidity(
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
    // const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidResponse = await this.bidSecurityRepository.findOne({
      where: {
        documentType: itemData.documentType,
        key: itemData.key,
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
    if (!bidResponse) {
      throw new BadRequestException('bid_response_not_found');
    }

    const decryptedValue = this.encryptionHelperService.decryptedData(
      bidResponse.value,
      itemData.password,
      bidResponse.bidRegistrationDetail.bidRegistration.salt,
    );
    return decryptedValue;
  }

  async getItems(lotId: string, query: CollectionQuery, req?: any) {
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

    if (itemId.length < 1) {
      return {
        total: 0,
        items: [],
      };
    }

    const itemRepository = manager.getRepository(Item);

    query.where.push([
      {
        column: 'id',
        value: itemId,
        operator: FilterOperators.In,
      },
    ]);

    const response = new DataResponseFormat<Item>();
    const dataQuery = QueryConstructor.constructQuery<Item>(
      itemRepository,
      query,
    );

    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
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

      const decryptedValue = this.encryptionHelperService.checkPasswordValidity(
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
}
