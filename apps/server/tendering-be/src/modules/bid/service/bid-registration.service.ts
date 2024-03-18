import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Tender } from 'src/entities';
import { BidBookmark } from 'src/entities/bid-bookmark.entity';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { ExtraCrudService } from 'src/shared/service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BidRegistrationService extends ExtraCrudService<BidRegistration> {
  constructor(
    @InjectRepository(BidRegistration)
    private readonly bidSecurityRepository: Repository<BidRegistration>,
    @Inject(REQUEST) private request: Request,
  ) {
    super(bidSecurityRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: itemData.tenderId,
      },
      relations: {
        tenderParticipationFee: true,
        bdsSubmission: true,
      },
    });

    if (!tender) {
      throw new Error('Tender not found');
    } else if (tender.bdsSubmission.submissionDeadline < new Date()) {
      throw new Error('Submission deadline has passed');
    }

    const bidBookmarkExists = await manager
      .getRepository(BidBookmark)
      .findOneBy({
        tenderId: itemData.tenderId,
        bidderId: itemData.bidderId,
      });

    if (bidBookmarkExists) {
      await manager.getRepository(BidBookmark).update(
        {
          tenderId: itemData.tenderId,
          bidderId: itemData.bidderId,
        },
        {
          status: 'REGISTERED',
        },
      );
    }
    let paymentLink = null;
    if (tender.tenderParticipationFee) {
      const invoice = await this.generatePaymentLink(
        tender.tenderParticipationFee.amount,
      );

      itemData.amount = tender.tenderParticipationFee.amount;
      itemData.currency = tender.tenderParticipationFee.currency;
      itemData.status = 'PENDING';
      itemData.paymentInvoice = invoice.paymentInvoice;

      paymentLink = invoice.paymentLink;
    }

    const item = manager.getRepository(BidRegistration).create(itemData);
    await manager.getRepository(BidRegistration).insert(item);
    return {
      ...item,
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
}
