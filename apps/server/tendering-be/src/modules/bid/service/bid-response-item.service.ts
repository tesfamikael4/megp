import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponseItem } from 'src/entities/bid-response-item.entity';
import { EntityManager, In, Repository } from 'typeorm';
import {
  BidResponseItemDto,
  CreateBidResponseItemDto,
  GetBidResponseItemDto,
} from '../dto/bid-response.dto';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { REQUEST } from '@nestjs/core';
import { EncryptionHelperService } from './encryption-helper.service';
import {
  Item,
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
        JSON.stringify({
          value: value.value,
        }),
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
    let rate = 0;
    for (const value of inputDto.values) {
      if (value.key === 'billOfMaterial') {
        const itemRate = this.buildBoQHierarchyWithRate(value.value);
        rate += itemRate?.reduce((total: any, current: any) => {
          if (current.rate == null) {
            throw new BadRequestException('rate_not_found');
          }
          return total + current.rate * current.quantity;
        }, 0);

        // value.value = this.assignRateToItems(value.value, itemRate);
      } else {
        rate += this.calculateItemRate(value.value);
      }

      const encryptedValue = this.encryptionHelperService.encryptData(
        JSON.stringify({
          value: value.value,
        }),
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

    const rateEncryptedValue = this.encryptionHelperService.encryptData(
      JSON.stringify({
        value: {
          rate: rate,
        },
      }),
      inputDto.password,
      bidRegistrationDetail.bidRegistration.salt,
    );
    const rateItem = manager.getRepository(BidResponseItem).create(inputDto);
    rateItem.bidRegistrationDetailId = bidRegistrationDetail.id;
    rateItem.value = rateEncryptedValue;
    rateItem.key = 'rate';

    await manager
      .getRepository(BidResponseItem)
      .upsert(rateItem, ['bidRegistrationDetailId', 'itemId', 'key']);

    return items;
  }

  async getBidResponseItemSorByKey(inputDto: GetBidResponseItemDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const items = await manager
      .getRepository(SorTechnicalRequirement)
      .findAndCountBy({
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

      const responses: any[] = JSON.parse(value)?.value;
      items[0] = items[0].map((item) => {
        let i = { ...item };
        i = { ...i, ...responses?.find((res) => res.id === i.id) };

        return i;
      });
    }
    return {
      total: items[1],
      items: items[0],
    };
  }

  async getBidResponseItemByKey(inputDto: GetBidResponseItemDto, req?: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = req.user.organization.id;

    const entityNames = {
      billOfMaterial: SorBillOfMaterial,
      equipment: SorEquipment,
      fee: SorFee,
      incidentalCost: SorIncidentalCost,
      labor: SorLabor,
      reimburseableExpense: SorReimburseableExpense,
    };

    const entityName = entityNames[inputDto.key];
    if (!entityName) {
      throw new BadRequestException('entity_not_found');
    }

    const items = await manager.getRepository(entityName).findAndCountBy({
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

    let responses: any[];
    if (bidResponse) {
      const value = this.encryptionHelperService.decryptedData(
        bidResponse.value,
        inputDto.password,
        bidResponse.bidRegistrationDetail.bidRegistration.salt,
      );

      responses = JSON.parse(value)?.value;
    }

    if (inputDto.isTree) {
      items[0] = this.buildBoQHierarchy(items[0], null, responses);
    } else {
      items[0] = items[0].map((item) => {
        let i = { ...item };
        i = { ...i, ...responses?.find((res) => res.id === i.id) };

        return i;
      });
    }

    return { total: items[1], items: items[0] };
  }

  async getFinancialItems(inputDto: BidResponseItemDto, req?: any) {
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

    const [result, total] = await manager.getRepository(Item).findAndCount({
      where: {
        id: In(itemId),
      },
      relations: {
        bidResponseItems: true,
      },
    });

    const newResult = result.map((item) => {
      let i: any = { ...item };
      const encryptedData = i.bidResponseItems?.find((x: BidResponseItem) => {
        return item.id == x.itemId && x.key === 'rate';
      });
      let decryptedData = null;
      if (encryptedData) {
        const data = JSON.parse(
          this.encryptionHelperService.decryptedData(
            encryptedData.value,
            inputDto.password,
            bidRegistrationDetail.bidRegistration.salt,
          ),
        );
        decryptedData = data?.value?.rate;
      }
      i = { ...i, rate: decryptedData };
      delete i.bidResponseItems;
      return i;
    });

    return {
      total,
      items: newResult,
    };
  }
  async getTechnicalItems(inputDto: BidResponseItemDto, req?: any) {
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

    const [result, total] = await manager.getRepository(Item).findAndCount({
      where: {
        id: In(itemId),
      },
    });

    return {
      total,
      items: result,
    };
  }

  private calculateBoQRate(items: any[], code = null) {
    const children = items.filter((item) => item.parentCode === code);

    if (children.length === 0) {
      return null;
    }
    return children.map((child) => {
      const childWithChildren = {
        ...child,
        children: this.calculateBoQRate(items, child.code),
      };

      if (childWithChildren.children) {
        childWithChildren.rate = childWithChildren.children.reduce(
          (total: any, current: any) => {
            if (current.rate == null) {
              throw new BadRequestException('rate_not_found');
            }
            return total + current.rate;
          },
          0,
        );
      }

      return childWithChildren;
    });
  }

  private buildBoQHierarchy(items: any[], code = null, responses: any) {
    const children = items?.filter((item) => item.parentCode === code);

    const newData = children?.map((child) => {
      child.rate = this.findItemById(responses, child.id);

      const childWithChildren = {
        ...child,
        children: this.buildBoQHierarchy(items, child.code, responses) ?? [],
      };

      return childWithChildren;
    });

    return newData;
  }

  private buildBoQHierarchyWithRate(items: any[]) {
    const calculateItem = (items: any[], current: any) => {
      let val = 0;
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          item.rate = calculateItem(item.children, item);
          val += item.rate;
        } else {
          if (!item.rate) {
            throw new BadRequestException('rate_not_found');
          }
          val += item.rate;
        }
      }
      return val * current.quantity;
    };
    for (const item of items) {
      let val = 0;
      if (item.children && item.children.length > 0) {
        val += calculateItem(item.children, item);
        item.rate = val;
      } else {
        if (!item.rate) {
          throw new BadRequestException('rate_not_found');
        }
        item.rate = item.quantity * item.rate;
      }
    }
    return items;
  }

  private calculateItemRate(items: any[]) {
    return items.reduce((total: any, current: any) => {
      if (current.rate == null) {
        throw new BadRequestException('rate_not_found');
      }
      return total + current.rate * current.quantity;
    }, 0);
  }

  private findItemById(items: any, id: string) {
    const flattened = this.flattenHierarchy(items);

    return flattened.find((item: any) => item.id === id)?.rate;
  }
  private flattenHierarchy(data: any, path = []) {
    const flatData = [];
    data.forEach((item: any) => {
      const currentPath = path.concat(item.name || item.id); // Use name or id for path
      flatData.push({ ...item, path: currentPath });
      if (item.children) {
        flatData.push(...this.flattenHierarchy(item.children, currentPath));
      }
    });
    return flatData;
  }
}
