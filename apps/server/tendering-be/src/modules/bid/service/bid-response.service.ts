import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BidResponse } from 'src/entities/bid-response.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import { CreateBidResponseDto } from '../dto/bid-response.dto';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { EnvelopTypeEnum } from 'src/shared/enums';
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

    const isSecretKeyValid = await this.secretKeyValid(
      bidRegistrationDetail,
      itemData.secretKey,
    );
    if (!isSecretKeyValid) {
      throw new BadRequestException('secret_key_invalid');
    }

    const item = this.bidSecurityRepository.create(itemData);
    item.bidRegistrationDetailId = bidRegistrationDetail.id;
    await this.bidSecurityRepository.insert(item);
    return item;
  }

  async secretKeyValid(
    bidRegistrationDetail: BidRegistrationDetail,
    password: string,
  ) {
    const data =
      bidRegistrationDetail.bidRegistration.bidderId +
      bidRegistrationDetail.bidRegistrationId;

    const decrypted = this.encryptionHelperService.decryptedData(
      bidRegistrationDetail.response,
      password,
      bidRegistrationDetail.salt,
    );

    return data == decrypted;

    // if (bidRegistrationDetail.envelopType == EnvelopTypeEnum.SINGLE_ENVELOP) {
    //   return bidRegistrationDetail.response == data;
    // } else {
    //   return bidRegistrationDetail.financialResponse == data;
    // }
  }
}
