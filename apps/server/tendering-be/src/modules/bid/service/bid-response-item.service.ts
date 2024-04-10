import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponseItem } from 'src/entities/bid-response-item.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateBidResponseItemDto,
  GetBidResponseItemDto,
} from '../dto/bid-response.dto';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { REQUEST } from '@nestjs/core';
import { EncryptionHelperService } from './encryption-helper.service';
import {
  SorBillOfMaterial,
  SorEquipment,
  SorFee,
  SorIncidentalCost,
  SorLabor,
  SorReimburseableExpense,
  SorTechnicalRequirement,
} from 'src/entities';

@Injectable()
export class BidResponseItemService {
  constructor(
    @InjectRepository(BidResponseItem)
    private readonly bidSecurityRepository: Repository<BidResponseItem>,
    private readonly encryptionHelperService: EncryptionHelperService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createBidResponseItemTechnicalResponse(
    inputDto: CreateBidResponseItemDto,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: inputDto.lotId,
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
      inputDto.documentType,
      inputDto.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const items = [];
    for (const value of inputDto.values) {
      const encryptedValue = this.encryptionHelperService.encryptData(
        JSON.stringify(value.value),
        inputDto.password,
        bidRegistrationDetail.bidRegistration.salt,
      );

      const item = manager.getRepository(BidResponseItem).create(inputDto);

      item.bidRegistrationDetailId = bidRegistrationDetail.id;
      item.value = encryptedValue;
      item.key = value.key;

      await manager
        .getRepository(BidResponseItem)
        .upsert(item, ['bidRegistrationDetailId', 'itemId', 'key']);

      items.push(item);
    }
    return items;
  }

  async createBidResponseItemFinancialResponse(
    inputDto: CreateBidResponseItemDto,
    req?: any,
  ): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: inputDto.lotId,
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
      inputDto.documentType,
      inputDto.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid_password');
    }

    const items = [];
    for (const value of inputDto.values) {
      const encryptedValue = this.encryptionHelperService.encryptData(
        JSON.stringify(value.value),
        inputDto.password,
        bidRegistrationDetail.bidRegistration.salt,
      );

      const item = manager.getRepository(BidResponseItem).create(inputDto);

      item.bidRegistrationDetailId = bidRegistrationDetail.id;
      item.value = encryptedValue;
      item.key = value.key;

      await manager
        .getRepository(BidResponseItem)
        .upsert(item, ['bidRegistrationDetailId', 'itemId', 'key']);

      items.push(item);
    }
    return items;
  }

  async getBidResponseItemSorByKey(inputDto: GetBidResponseItemDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    let items = await manager.getRepository(SorTechnicalRequirement).findBy({
      itemId: inputDto.itemId,
      sorType: inputDto.key,
    });

    const bidResponse = await this.bidSecurityRepository.findOne({
      where: {
        itemId: inputDto.itemId,
        documentType: inputDto.documentType,
        key: inputDto.key,
        bidRegistrationDetail: {
          lotId: inputDto.lotId,
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

    if (bidResponse) {
      const value = this.encryptionHelperService.decryptedData(
        bidResponse.value,
        inputDto.password,
        bidResponse.bidRegistrationDetail.bidRegistration.salt,
      );

      const responses: any[] = JSON.parse(value);
      items = items.map((item) => {
        let i = { ...item };
        i = { ...i, ...responses.find((res) => res.id === i.id) };

        return i;
      });
    }
    return items;
  }

  async getBidResponseItemByKey(inputDto: GetBidResponseItemDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const entityNames = {
      BillOfMaterial: SorBillOfMaterial,
      Equipment: SorEquipment,
      Fee: SorFee,
      IncidentalCost: SorIncidentalCost,
      Labor: SorLabor,
      ReimburseableExpense: SorReimburseableExpense,
    };

    const entityName = entityNames[inputDto.key];
    if (!entityName) {
      throw new BadRequestException('entity_not_found');
    }

    let items = await manager.getRepository(entityName).findBy({
      itemId: inputDto.itemId,
    });

    const bidResponse = await this.bidSecurityRepository.findOne({
      where: {
        itemId: inputDto.itemId,
        documentType: inputDto.documentType,
        key: inputDto.key,
        bidRegistrationDetail: {
          lotId: inputDto.lotId,
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

    if (bidResponse) {
      const value = this.encryptionHelperService.decryptedData(
        bidResponse.value,
        inputDto.password,
        bidResponse.bidRegistrationDetail.bidRegistration.salt,
      );

      const responses: any[] = JSON.parse(value);
      items = items.map((item) => {
        let i = { ...item };
        i = { ...i, ...responses.find((res) => res.id === i.id) };

        return i;
      });
    }
    return items;
  }
}
