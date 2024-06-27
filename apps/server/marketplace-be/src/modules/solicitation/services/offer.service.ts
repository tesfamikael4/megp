import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import {
  OpenedOffer,
  RFXItem,
  RfxProductInvitation,
  SolOffer,
  SolRegistration,
  SolRound,
} from 'src/entities';
import {
  EntityManager,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateOfferDto } from '../dtos/offer.dto';
import {
  EInvitationStatus,
  ERfxItemStatus,
  ESolRoundStatus,
} from 'src/utils/enums';
import { EncryptionHelperService } from '../../../utils/services/encryption-helper.service';
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
            status: In([EInvitationStatus.ACCEPTED, EInvitationStatus.COMPLY]),
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
          status: true,
        },
      }),
    ]);

    if (!rfxItem) throw new Error('RFQ item not found');
    if (!rfxInvitation) throw new Error('Invited Product not found');

    const currentRound = await this.getValidRound(rfxItem.rfx.id);

    if (rfxInvitation.status == EInvitationStatus.NOT_COMPLY)
      throw new BadRequestException('Invitation response is not comply');

    if (
      rfxInvitation.status !== EInvitationStatus.ACCEPTED &&
      currentRound.round == 0
    )
      throw new BadRequestException(
        'Invitation is not Accepted. Please Accept First',
      );

    // if (currentRound.round >= 1) {
    //   await this.checkPreviousRoundOfferExists(
    //     currentRound.round,
    //     itemData,
    //     user,
    //   );
    // }

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
    itemData.encryptedTax = this.encryptPrice(
      `${itemData.tax}`,
      registration.salt,
    );

    const offer = offerRepo.create(itemData);
    await offerRepo.upsert(offer, {
      conflictPaths: {
        rfxItemId: true,
        solRegistrationId: true,
        solRoundId: true,
        rfxProductInvitationId: true,
      },
    });
    return offer;
  }

  async getLatestOfferWithOrganizationId(
    rfxProductInvitationId: string,
    user: any,
  ) {
    const previousRound = await this.solRoundRepository.findOne({
      where: {
        endingTime: LessThanOrEqual(new Date()),
        status: ESolRoundStatus.COMPLETED,
      },
      order: {
        round: 'DESC',
      },
      select: {
        id: true,
      },
    });

    if (!previousRound) return { round: null };

    const offer = await this.solOfferRepository.findOne({
      where: {
        rfxProductInvitationId,
        solRoundId: previousRound.id,
        solRegistration: {
          vendorId: user.organization.id,
        },
      },
      relations: {
        solRegistration: true,
      },
    });

    if (!offer) return { price: null };

    const price = this.encryptionHelperService.decryptedData(
      offer.encryptedPrice,
      '123456',
      offer.solRegistration.salt,
    );
    const tax = this.encryptionHelperService.decryptedData(
      offer.encryptedTax,
      '123456',
      offer.solRegistration.salt,
    );

    const taxedPrice = +price * (1 + +tax / 100);

    return { ...offer, price: +price, tax: +tax, taxedPrice };
  }

  async getVendorsSolicitationOffer(solRegistrationId: string) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    return await entityManager.getRepository(OpenedOffer).find({
      where: {
        solRegistrationId,
        solRound: {
          round: 0,
        },
      },
      relations: {
        rfxItem: {
          technicalRequirement: true,
        },
      },
    });
  }

  private async getValidRound(rfxId: string) {
    const now = new Date();

    const round = await this.solRoundRepository.findOne({
      where: {
        rfxId,
        startingTime: LessThanOrEqual(now),
        endingTime: MoreThanOrEqual(now),
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
    const previousOffer = await this.solOfferRepository.exists({
      where: {
        solRound: {
          round: currentRound - 1,
        },
        rfxProductInvitationId: itemData.rfxProductInvitationId,
        vendorId: user.organization.id,
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
