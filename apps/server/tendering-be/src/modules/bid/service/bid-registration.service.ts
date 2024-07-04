import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsSubmission, Tender } from 'src/entities';
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
  AwardTypeEnum,
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
    private readonly bidRegistrationRepository: Repository<BidRegistration>,
    private readonly encryptionHelperService: EncryptionHelperService,
    @Inject(REQUEST) private request: Request,
  ) {
    super(bidRegistrationRepository);
  }

  async create(itemData: CreateBidRegistrationDto, req?: any): Promise<any> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: itemData.tenderId,
      },
      relations: {
        lots: {
          items: true,
        },
        bdsEvaluation: true,
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
    const bidderRegistrationNo = req.user.organization.code;

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

    const bidRegistration = this.bidRegistrationRepository.create({
      tenderId: itemData.tenderId,
      bidderId,
      bidderName,
      bidderRegistrationNo,
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
      itemData.financialPassword,
      itemData.technicalPassword,
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
      if (tender.bdsEvaluation.awardType == AwardTypeEnum.LOT_BASED) {
        const itemId = lot?.items?.map((x) => x.id);

        bidRegistrationDetail.financialItems = itemId;
        bidRegistrationDetail.financialItems = itemId;
      }

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

  async findOne(id: any, req?: any): Promise<BidRegistration> {
    const bidderId = req.user.organization.id;

    return await this.bidRegistrationRepository.findOne({
      where: { tenderId: id, bidderId },
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
      this.bidRegistrationRepository,
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

  async getRegisteredBidByTenderId(tenderId: string, req?: any): Promise<any> {
    return await this.bidRegistrationRepository.findOne({
      where: { tenderId: tenderId, bidderId: req.user.organization.id },
      relations: {
        tender: {
          lots: true,
        },
      },
    });
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
          bidResponseItems: true,
        },
      });

    if (!bidRegistrationDetail) {
      throw new BadRequestException('bid_registration_not_found');
    } else if (
      !bidRegistrationDetail.financialItems &&
      bidRegistrationDetail.financialItems.length < 1
    ) {
      throw new BadRequestException('financial_items_not_found');
    } else if (
      !bidRegistrationDetail.technicalItems &&
      bidRegistrationDetail.technicalItems.length < 1
    ) {
      throw new BadRequestException('technical_items_not_found');
    } else if (
      bidRegistrationDetail.financialItems.length !=
        bidRegistrationDetail.technicalItems.length ||
      !bidRegistrationDetail.financialItems.every((x) =>
        bidRegistrationDetail.technicalItems.some((y) => y == x),
      )
    ) {
      throw new BadRequestException('item_mis_match');
    }

    bidRegistrationDetail.financialItems.forEach((element) => {
      const rate = bidRegistrationDetail.bidResponseItems.find(
        (x) => x.itemId == element && x.key == 'rate',
      );
      const specification = bidRegistrationDetail.bidResponseItems.find(
        (x) => x.itemId == element && x.key == 'specification',
      );
      if (!rate || !specification) {
        throw new BadRequestException('required_values_not_filled');
      }
    });

    const bdsSubmission = await manager.getRepository(BdsSubmission).findOneBy({
      tenderId: bidRegistrationDetail.bidRegistration.tenderId,
    });
    if (!bdsSubmission) {
      throw new BadRequestException('bds_submission_not_found');
    } else if (bdsSubmission.submissionDeadline < new Date()) {
      throw new BadRequestException('submission_deadline_passed');
    }

    await manager
      .getRepository(BidRegistrationDetail)
      .update(bidRegistrationDetail.id, {
        status: BidRegistrationDetailStatusEnum.SUBMITTED,
      });

    const { bidRegistration, bidResponseItems, ...rest } =
      bidRegistrationDetail;

    return {
      ...rest,
      status: BidRegistrationDetailStatusEnum.SUBMITTED,
    };
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
      this.bidRegistrationRepository,
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
      this.bidRegistrationRepository,
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
      this.bidRegistrationRepository,
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
    financialPassword: string,
    technicalPassword: string,
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
    if (envelopType == EnvelopTypeEnum.SINGLE_ENVELOP) {
      const encryptedData = this.encryptionHelperService.encryptData(
        dataToEncrypt,
        password,
        salt,
      );
      return {
        response: encryptedData,
      };
    } else {
      const encryptedFinancialData = this.encryptionHelperService.encryptData(
        dataToEncrypt,
        financialPassword,
        salt,
      );

      const encryptedTechnicalData = this.encryptionHelperService.encryptData(
        dataToEncrypt,
        technicalPassword,
        salt,
      );
      return {
        financialResponse: encryptedFinancialData,
        technicalResponse: encryptedTechnicalData,
      };
    }
  }
}
