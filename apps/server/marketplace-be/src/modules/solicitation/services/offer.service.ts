import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import {
  RFXItem,
  RfxProductInvitation,
  SolOffer,
  SolRegistration,
  SolRound,
} from 'src/entities';
import { EntityManager, MoreThan, Repository } from 'typeorm';
import { CreateOfferDto } from '../dtos/offer.dto';
import { ERfxItemStatus } from 'src/utils/enums';
import { EncryptionHelperService } from './encryption-helper.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class SolOfferService extends ExtraCrudService<SolOffer> {
  constructor(
    @InjectRepository(SolOffer)
    private readonly solOfferRepository: Repository<SolOffer>,
    @InjectRepository(SolRound)
    private readonly solRoundRepository: Repository<SolRound>,
    @Inject(REQUEST) private request: Request,
    private readonly encryptionHelperService: EncryptionHelperService,
  ) {
    super(solOfferRepository);
  }

  async create(itemData: CreateOfferDto, user: any) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const offerRepo = entityManager.getRepository(SolOffer);
    const invitationRepo = entityManager.getRepository(RfxProductInvitation);
    const registrationRepo = entityManager.getRepository(SolRegistration);
    const itemsRepo = entityManager.getRepository(RFXItem);

    const [rfxItem, rfxInvitation] = await Promise.all([
      itemsRepo.findOne({
        where: {
          id: itemData.rfxItemId,
          status: ERfxItemStatus.APPROVED,
          rfxProductInvitations: {
            vendorId: user?.organization.id,
          },
        },
        relations: {
          rfx: true,
        },
        select: {
          rfx: {
            id: true,
          },
        },
      }),
      invitationRepo.findOne({
        where: {
          id: itemData.rfxProductInvitationId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!rfxItem) throw new Error('RFQ item not found');
    if (!rfxInvitation) throw new Error('Invited Product not found');

    const currentRound = await this.getValidRound(rfxItem.rfx.id);

    if (currentRound.round >= 1) {
      await this.checkPreviousRoundOfferExists(
        currentRound.round,
        itemData,
        user,
      );
    }

    const registration = await registrationRepo.findOne({
      where: {
        rfxId: rfxItem.rfx.id,
        vendorId: user?.organization.id,
      },
      select: {
        id: true,
        salt: true,
      },
    });

    if (!registration) throw new Error('Registration not found');

    // Offer Price Validation

    itemData.solRoundId = currentRound.id;
    itemData.solRegistrationId = registration.id;
    itemData.encryptedPrice = this.encryptPrice(
      `${itemData.price}`,
      registration.salt,
    );

    const offer = offerRepo.create(itemData);
    await offerRepo.upsert(offer, [
      'rfxItemId',
      'vendorId',
      'solRoundId',
      'rfxProductInvitationId',
    ]);
    return offer;
  }

  private async getValidRound(rfxId: string) {
    const now = new Date(Date.now());

    const round = await this.solRoundRepository.findOne({
      where: {
        rfxId,
        end: MoreThan(now),
      },
      order: {
        round: 'ASC',
      },
    });

    if (!round) throw new Error('Round at this time is not found');

    return round;
  }

  private async checkPreviousRoundOfferExists(
    currentRound: number,
    itemData: CreateOfferDto,
    user: any,
  ) {
    const previousOffer = await this.solOfferRepository.findOne({
      where: {
        solRound: {
          round: currentRound - 1,
        },
        rfxItemId: itemData.rfxItemId,
        rfxProductInvitationId: itemData.rfxProductInvitationId,
        vendorId: user.organization.id,
      },
      select: {
        id: true,
      },
    });

    if (!previousOffer) throw new Error('Previous offer not found');

    return previousOffer;
  }

  private encryptPrice(price: string, salt) {
    const encryptedPrice = this.encryptionHelperService.encryptData(
      price,
      '123456',
      salt,
    );

    return encryptedPrice;
  }
}
