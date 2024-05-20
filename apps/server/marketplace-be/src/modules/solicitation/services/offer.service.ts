import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RFXItem, SolOffer, SolRound } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateOfferDto } from '../dtos/offer.dto';
import { EInvitationStatus, ERfxStatus } from 'src/utils/enums';

@Injectable()
export class SolOfferService extends ExtraCrudService<SolOffer> {
  constructor(
    @InjectRepository(SolOffer)
    private readonly solOfferRepository: Repository<SolOffer>,
    @InjectRepository(SolRound)
    private readonly solRoundRepository: Repository<SolRound>,
    @InjectRepository(RFXItem)
    private readonly rfxItemRepository: Repository<RFXItem>,
  ) {
    super(solOfferRepository);
  }

  async create(itemData: CreateOfferDto, user: any): Promise<any> {
    const round = await this.getValidRound(itemData.roundId);

    const rfxItem = await this.rfxItemRepository.findOne({
      where: {
        id: itemData.rfxItemId,
        bidInvitations: {
          vendorId: user?.organization.id,
        },
      },
      relations: {
        rfx: {
          rfxBidProcedure: true,
        },
        bidInvitations: true,
      },
    });

    if (!rfxItem) throw new Error('Rfx item not found');

    // this.validateOfferSubmit(rfxItem);

    // Offer Price Validation

    const offer = this.solOfferRepository.create(itemData);
    await this.solOfferRepository.insert(offer);
    return offer;
  }

  validateOfferSubmit(rfxItem: RFXItem) {
    if (rfxItem.rfx.status !== ERfxStatus.APPROVED)
      throw new Error('Rfx not approved');

    if (rfxItem.bidInvitations[0].status !== EInvitationStatus.ACCEPTED)
      throw new Error('Invitation not accepted');

    const now = new Date(Date.now());
    const deadline = new Date(rfxItem.rfx.rfxBidProcedure.submissionDeadline);

    if (now >= deadline) throw new Error('Rfx Submission Deadline Passed');
  }

  private async getValidRound(roundId: string) {
    const now = new Date(Date.now());

    const round = await this.solRoundRepository.findOne({
      where: {
        id: roundId,
        // start: LessThan(now),
        // end: MoreThan(now),
      },
    });

    if (!round) throw new Error('Round at this time is not found');

    if (round.start > now) throw new Error('Round has not been started yet');
    else if (round.end < now) throw new Error('Round has ended');

    return round;
  }
}
