import { Injectable } from '@nestjs/common';
import {
  OpenedItemResponse,
  OpenedOffer,
  OpenedResponse,
  RFX,
  SolRegistration,
  SolRound,
} from 'src/entities';
import {
  EInvitationStatus,
  ESolOfferStatus,
  ESolRegistrationStatus,
} from 'src/utils/enums';
import { EncryptionHelperService } from 'src/utils/services/encryption-helper.service';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { DataSource } from 'typeorm';

@Injectable()
export class OpenerSerivice {
  constructor(private schedulerService: SchedulerService) {}
  async openAndEvaluateResponses(
    dataSource: DataSource,
    encryptionHelperService: EncryptionHelperService,
    payload: any,
  ) {
    const round = payload.round;
    const rfxId = payload.rfxId;

    const roundRepo = dataSource.getRepository(SolRound);
    const solRegistrationRepo = dataSource.getRepository(SolRegistration);
    const openedResponseRepo = dataSource.getRepository(OpenedResponse);
    const openedItemResponseRepo = dataSource.getRepository(OpenedItemResponse);
    const openedOffersRepo = dataSource.getRepository(OpenedOffer);

    const registrations = await solRegistrationRepo.find({
      where: {
        rfxId,
        solOffers: {
          solRound: {
            round,
          },
        },
        rfx: {
          items: {
            rfxProductInvitations: {
              status: EInvitationStatus.ACCEPTED,
            },
          },
        },
        status: ESolRegistrationStatus.REGISTERED,
      },
      relations: {
        rfx: {
          rfxBidProcedure: true,
        },
        solItemResponses: true,
        solOffers: true,
        solResponses: true,
      },
    });

    const decryptedResponses = [];
    const decryptedItemResponses = [];
    const decryptedOffers = [];

    for (const registration of registrations) {
      if (round == 0) {
        // decrypt documentary evidences
        for (const response of registration.solResponses) {
          const result = encryptionHelperService.decryptedData(
            response.value,
            '123456',
            registration.salt,
          );

          decryptedResponses.push({
            ...response,
            solResponseId: response.id,
            value: JSON.parse(result),
            createdAt: undefined,
            updatedAt: undefined,
          });
        }

        // Decrypt Documentar
        for (const response of registration.solItemResponses) {
          const result = encryptionHelperService.decryptedData(
            response.value,
            '123456',
            registration.salt,
          );

          decryptedItemResponses.push({
            ...response,
            solItemResponseId: response.id,
            value: JSON.parse(result),
            createdAt: undefined,
            updatedAt: undefined,
          });
        }

        const createdResponse = openedResponseRepo.create(decryptedResponses);
        const createdItemResponse = openedItemResponseRepo.create(
          decryptedItemResponses,
        );
        await Promise.all([
          openedResponseRepo.insert(createdResponse),
          openedItemResponseRepo.insert(createdItemResponse),
        ]);
      }

      for (const offer of registration.solOffers) {
        const result = encryptionHelperService.decryptedData(
          offer.encryptedPrice,
          '123456',
          registration.salt,
        );

        decryptedOffers.push({
          ...offer,
          price: +result,
          status: ESolOfferStatus.NEXT,
          solOfferId: offer.id,
          createdAt: undefined,
          updatedAt: undefined,
        });
      }
    }
    const minPrice = Math.min(...decryptedOffers.map((o) => o.price));
    const minPriceIndex = decryptedOffers.findIndex((o) => o.price == minPrice);
    decryptedOffers[minPriceIndex].status = ESolOfferStatus.WINNER;

    const createdOffers = openedOffersRepo.create(decryptedOffers);
    await openedOffersRepo.insert(createdOffers);

    const decreament =
      (minPrice * registrations[0].rfx.rfxBidProcedure.deltaPercentage) / 100;
    const nextRoundBeginning = minPrice - decreament;

    const [, nextRound] = await Promise.all([
      roundRepo.update(
        { rfxId },
        {
          startingPrice: nextRoundBeginning,
        },
      ),
      roundRepo.findOne({
        where: {
          round: round + 1,
          rfxId,
        },
        select: {
          id: true,
          end: true,
        },
      }),
    ]);

    if (nextRound)
      await this.schedulerService.scheduleWithEncryption(
        this.openAndEvaluateResponses,
        nextRound.end,
        { round: round + 1, rfxId },
      );

    return createdOffers;
  }
}
