import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Tender } from 'src/entities';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateBidRegistrationDto,
  CreateBidRegistrationStatusDto,
} from '../dto/bid-registration.dto';
import {
  BidRegistrationDetailStatusEnum,
  BidRegistrationStatusEnum,
  EnvelopTypeEnum,
} from 'src/shared/enums';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import * as crypto from 'crypto';
import { EncryptionHelperService } from './encryption-helper.service';

@Injectable()
export class BidRegistrationService extends ExtraCrudService<BidRegistration> {
  constructor(
    @InjectRepository(BidRegistration)
    private readonly bidSecurityRepository: Repository<BidRegistration>,
    private readonly encryptionHelperService: EncryptionHelperService,
    @Inject(REQUEST) private request: Request,
  ) {
    super(bidSecurityRepository);
  }

  async create(itemData: CreateBidRegistrationDto, req?: any): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: itemData.tenderId,
      },
      relations: {
        lots: true,
        tenderParticipationFee: true,
        bdsSubmission: true,
      },
    });

    if (!tender) {
      throw new BadRequestException('tender_not_found');
    } else if (tender.bdsSubmission.submissionDeadline < new Date()) {
      throw new BadRequestException('submission_deadline_has_passed');
    }

    const bidderId = req.user.organization.id;
    const bidderName = req.user.organization.name;

    const bidBookmarkExists = await manager
      .getRepository(BidBookmark)
      .findOneBy({
        tenderId: itemData.tenderId,
        bidderId: bidderId,
      });

    if (bidBookmarkExists) {
      await manager.getRepository(BidBookmark).update(
        {
          tenderId: itemData.tenderId,
          bidderId: bidderId,
        },
        {
          status: 'REGISTERED',
        },
      );
    }
    let paymentLink = null;

    const saltLength = 16;
    const salt = crypto
      .randomBytes(Math.ceil(saltLength / 2))
      .toString('hex')
      .slice(0, saltLength);

    const bidRegistration = this.bidSecurityRepository.create({
      tenderId: itemData.tenderId,
      bidderId: bidderId,
      bidderName: bidderName,
      salt: salt,
      envelopType: tender.bdsSubmission.envelopType,
    });
    if (tender.tenderParticipationFee) {
      const invoice = await this.generatePaymentLink(
        tender.tenderParticipationFee.amount,
      );

      bidRegistration.amount = tender.tenderParticipationFee.amount;
      bidRegistration.currency = tender.tenderParticipationFee.currency;
      bidRegistration.status = 'PENDING';
      bidRegistration.paymentInvoice = invoice.paymentInvoice;

      paymentLink = invoice.paymentLink;
    }

    await manager.getRepository(BidRegistration).insert(bidRegistration);

    const dataToEncrypt = bidderId + bidRegistration.id;

    const encryptedData = this.generateInitialEncryption(
      dataToEncrypt,
      itemData.password,
      tender.bdsSubmission.envelopType,
      salt,
    );
    await manager
      .getRepository(BidRegistration)
      .update(bidRegistration.id, { ...encryptedData });
    const bidRegistrationDetails: BidRegistrationDetail[] = [];

    for (const lot of tender.lots) {
      const bidRegistrationDetail = manager
        .getRepository(BidRegistrationDetail)
        .create({
          bidRegistrationId: bidRegistration.id,
          lotId: lot.id,
        });

      bidRegistrationDetails.push(bidRegistrationDetail);
    }

    await manager
      .getRepository(BidRegistrationDetail)
      .insert(bidRegistrationDetails);

    return {
      ...bidRegistration,
      paymentLink,
    };
  }

  async findOne(id: any) {
    return await this.bidSecurityRepository.findOne({
      where: { id },
      relations: {
        tender: {
          lots: {
            bdsBidSecurity: true,
          },
        },
      },
    });
  }

  async getMyRegisteredBids(query: CollectionQuery, req?: any): Promise<any> {
    query.includes.push('tender');
    query.includes.push('tender.lots');

    query.where.push([
      {
        column: 'bidderId',
        operator: FilterOperators.EqualTo,
        value: req.user.organization.id,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<BidRegistration>(
      this.bidSecurityRepository,
      query,
    );
    const response = new DataResponseFormat<BidRegistration>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async submitLot(payload: CreateBidRegistrationStatusDto, user: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const bidderId = user.organization.id;

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: payload.lotId,
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

    await manager
      .getRepository(BidRegistrationDetail)
      .update(bidRegistrationDetail.id, {
        status: BidRegistrationDetailStatusEnum.SUBMITTED,
      });
  }

  async getAllBiddersByTenderId(tenderId: string, query: CollectionQuery) {
    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: BidRegistrationStatusEnum.REGISTERED,
      },
    ]);
    query.where.push([
      {
        column: 'tenderId',
        operator: FilterOperators.EqualTo,
        value: tenderId,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<BidRegistration>(
      this.bidSecurityRepository,
      query,
    ).leftJoinAndSelect(
      'bid_registrations.bidRegistrationDetails',
      'bidRegistrationDetails',
    );

    const response = new DataResponseFormat<BidRegistration>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async getSubmittedBiddersByTenderId(
    tenderId: string,
    query: CollectionQuery,
  ) {
    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: BidRegistrationStatusEnum.REGISTERED,
      },
    ]);
    query.where.push([
      {
        column: 'tenderId',
        operator: FilterOperators.EqualTo,
        value: tenderId,
      },
    ]);

    query.includes.push('sharedBidderKeys');

    const dataQuery = QueryConstructor.constructQuery<BidRegistration>(
      this.bidSecurityRepository,
      query,
    )
      .leftJoin(
        'bid_registrations.bidRegistrationDetails',
        'bidRegistrationDetails',
      )
      .andWhere('bidRegistrationDetails.status = :submissionStatus', {
        submissionStatus: BidRegistrationDetailStatusEnum.SUBMITTED,
      });

    const response = new DataResponseFormat<BidRegistration>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async getSubmittedBiddersByLotId(lotId: string, query: CollectionQuery) {
    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: BidRegistrationStatusEnum.REGISTERED,
      },
    ]);

    const dataQuery = QueryConstructor.constructQuery<BidRegistration>(
      this.bidSecurityRepository,
      query,
    )
      .leftJoin(
        'bid_registrations.bidRegistrationDetails',
        'bidRegistrationDetails',
      )
      .andWhere(
        'bidRegistrationDetails.status = :submissionStatus AND bidRegistrationDetails.lotId = :lotId',
        {
          submissionStatus: BidRegistrationDetailStatusEnum.SUBMITTED,
          lotId: lotId,
        },
      );

    const response = new DataResponseFormat<BidRegistration>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  private async generatePaymentLink(amount: number) {
    const paymentInvoice = `INVOICE-${Date.now()}-${amount}`;
    //TODO: call payment gateway API here

    return {
      paymentInvoice,
      paymentLink:
        'https://dev-bo.megp.peragosystems.com/infrastructure/api/mpgs-payments/initiate',
    };
  }

  private generateInitialEncryption(
    dataToEncrypt: string,
    password: string,
    envelopType: string,
    salt: string,
  ):
    | {
        response: string;
      }
    | {
        financialResponse: string;
        technicalResponse: string;
      } {
    const encryptedData = this.encryptionHelperService.encryptData(
      dataToEncrypt,
      password,
      salt,
    );

    if (envelopType == EnvelopTypeEnum.SINGLE_ENVELOP) {
      return {
        response: encryptedData,
      };
    } else {
      return {
        financialResponse: encryptedData,
        technicalResponse: encryptedData,
      };
    }
  }
}
