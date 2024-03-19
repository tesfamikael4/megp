import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Tender } from 'src/entities';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';
import { CreateBidRegistrationDto } from '../dto/bid-registration.dto';
import { EnvelopTypeEnum } from 'src/shared/enums';

@Injectable()
export class BidRegistrationService extends ExtraCrudService<BidRegistration> {
  constructor(
    @InjectRepository(BidRegistration)
    private readonly bidSecurityRepository: Repository<BidRegistration>,
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
      throw new Error('Tender not found');
    } else if (tender.bdsSubmission.submissionDeadline < new Date()) {
      throw new Error('Submission deadline has passed');
    }

    const bidderId = req.user.organization.id;

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

    const bidRegistration = this.bidSecurityRepository.create({
      tenderId: itemData.tenderId,
      bidderId: bidderId,
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
    const bidRegistrationDetails: BidRegistrationDetail[] = [];

    for (const lot of tender.lots) {
      const dataToEncrypt = bidderId + tender.id + bidRegistration.id;

      const encryptedData = await this.generateInitialEncryption(
        dataToEncrypt,
        'private key',
        tender.bdsSubmission.envelopType,
      );

      const bidRegistrationDetail = manager
        .getRepository(BidRegistrationDetail)
        .create({
          bidRegistrationId: bidRegistration.id,
          lotId: lot.id,
          ...encryptedData,
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

  async generatePaymentLink(amount: number) {
    const paymentInvoice = `INVOICE-${Date.now()}-${amount}`;
    //TODO: call payment gateway API here

    return {
      paymentInvoice,
      paymentLink:
        'https://dev-bo.megp.peragosystems.com/infrastructure/api/mpgs-payments/initiate',
    };
  }

  async generateInitialEncryption(
    dataToEncrypt: string,
    privateKey: string,
    envelopType: string,
  ) {
    if (envelopType == EnvelopTypeEnum.SINGLE_ENVELOP) {
      return {
        response: dataToEncrypt + privateKey,
      };
    } else {
      return {
        financialResponse: dataToEncrypt + privateKey,
        technicalResponse: dataToEncrypt + privateKey,
        response: dataToEncrypt + privateKey,
      };
    }
  }
}
