import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  OpenedItemResponse,
  OpenedOffer,
  OpenedResponse,
  RFX,
  RFXItem,
  RfxBidProcedure,
  SolItemResponse,
  SolOffer,
  SolRegistration,
  SolResponse,
  SolRound,
  SolRoundAward,
} from 'src/entities';
import { RfxDocumentaryEvidence } from 'src/entities/rfx-documentary-evidence.entity';
import {
  EInvitationStatus,
  ERfxItemStatus,
  ERfxStatus,
  ESolOfferStatus,
  ESolRegistrationStatus,
  ESolRoundStatus,
} from 'src/utils/enums';
import { EncryptionHelperService } from 'src/utils/services/encryption-helper.service';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { DataSource, EntityManager, In, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class OpenerService {
  constructor(
    private schedulerService: SchedulerService,
    private readonly encryptionHelperService: EncryptionHelperService,
  ) {}

  async openAndEvaluateResponses(
    dataSource: DataSource,
    encryptionHelperService: EncryptionHelperService,
    payload: any,
  ) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.connection.transaction(
        async (entityManager) => {
          const round = payload.round;

          await checkValidRfx(entityManager);
          await openResponses(entityManager);

          const [items, rfxBidProcedure] = await filterItems(entityManager);

          if (round > 0) {
            await calculateRoundWinner(items, rfxBidProcedure, entityManager);
            await endRound(entityManager);
          }
        },
      );
    } catch (error) {
      if (error.status == 430) Logger.error(error, 'OpenerService');
      else await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
    async function filterItems(
      entityManager: EntityManager,
    ): Promise<[RFXItem[], RfxBidProcedure]> {
      const itemRepo = entityManager.getRepository(RFXItem);
      const rfxRepo = entityManager.getRepository(RFX);
      const roundRepo = entityManager.getRepository(SolRound);
      const procedureRepo = entityManager.getRepository(RfxBidProcedure);

      const [validItems, rfxBidProcedure] = await Promise.all([
        itemRepo
          .createQueryBuilder('rfx_items')
          .where('rfx_items.rfxId = :rfxId', { rfxId: payload.rfxId })
          .andWhere('rfx_items.status = :status', {
            status: ERfxItemStatus.APPROVED,
          })
          .leftJoinAndSelect('rfx_items.openedOffers', 'openedOffers')
          .leftJoin('openedOffers.solRound', 'solRound')
          .leftJoin(
            'openedOffers.rfxProductInvitation',
            'rfxProductInvitations',
          )
          .where('solRound.round = :round', { round: payload.round })
          .andWhere('rfxProductInvitations.status IN (:...status)', {
            status: [EInvitationStatus.ACCEPTED, EInvitationStatus.COMPLY],
          })
          .getMany(),
        procedureRepo.findOne({
          where: { rfxId: payload.rfxId },
          select: { id: true, deltaPercentage: true, round: true },
        }),
      ]);

      if (validItems.length == 0) {
        await Promise.all([
          rfxRepo.update(payload.rfxId, {
            status: ERfxStatus.ENDED,
          }),
          roundRepo.update(
            { round: MoreThanOrEqual(payload.round), rfxId: payload.rfxId },
            {
              status: ESolRoundStatus.CANCELLED,
            },
          ),
        ]);
        throw new HttpException(
          `No valid items found for this RFQ id ${payload.rfxId}`,
          430,
        );
      }

      return [validItems, rfxBidProcedure];
    }
    async function checkValidRfx(entityManager: EntityManager) {
      const rfxRepo = entityManager.getRepository(RFX);
      const roundRepo = entityManager.getRepository(SolRound);

      const [activeRfx, activeRound] = await Promise.all([
        rfxRepo.exists({
          where: {
            status: In([ERfxStatus.APPROVED, ERfxStatus.AUCTION]),
            id: payload.rfxId,
          },
        }),
        roundRepo.exists({
          where: {
            round: payload.round,
            status: ESolRoundStatus.PENDING,
          },
        }),
      ]);

      if (!activeRfx) {
        throw new BadRequestException(
          `No Active RFQ found for this RFQ id ${payload.rfxId}`,
        );
      }
      if (!activeRound) {
        throw new BadRequestException(
          `No Active Round found for this RFQ id ${payload.rfxId}`,
        );
      }
    }
    async function endRound(entityManager: EntityManager) {
      const roundRepo = entityManager.getRepository(SolRound);
      const rfxRepo = entityManager.getRepository(RFX);

      if (payload.round == 0) {
        await rfxRepo.update(payload.rfxId, {
          status: ERfxStatus.EVALUATION,
        });
        return;
      }

      const nextRound = await roundRepo.findOne({
        where: {
          round: payload.round + 1,
          rfxId: payload.rfxId,
        },
        select: {
          id: true,
          end: true,
        },
      });

      if (payload.round != 0 && !nextRound) {
        await rfxRepo.update(payload.rfxId, {
          status: ERfxStatus.ENDED,
        });
      }
    }

    async function calculateRoundWinner(
      items: RFXItem[],
      rfxBidProcedure: RfxBidProcedure,
      entityManager: EntityManager,
    ) {
      const roundAwardRepo = entityManager.getRepository(SolRoundAward);
      const itemRepo = entityManager.getRepository(RFXItem);
      const openedOfferRepo = entityManager.getRepository(OpenedOffer);

      const solRoundAwards = [];
      const rankedOffers = [];

      for (const item of items) {
        if (item.openedOffers.length == 0) {
          await itemRepo.update(item.id, {
            status: ERfxItemStatus.ENDED,
          });
          continue;
        }
        const sortedOffers = item.openedOffers.sort(
          (a, b) => a.taxedPrice - b.taxedPrice,
        );

        const offerRank = sortedOffers.map((offer, index) => ({
          ...offer,
          updatedAt: undefined,
          rank: index + 1,
        }));
        rankedOffers.push(...offerRank);

        const minPriceOffer = sortedOffers[0];

        const decrement =
          (minPriceOffer.price * rfxBidProcedure.deltaPercentage) / 100;
        const nextRoundStartingPrice = minPriceOffer.price - decrement;

        solRoundAwards.push({
          rfxProductInvitationId: minPriceOffer.rfxProductInvitationId,
          solOfferId: minPriceOffer.solOfferId,
          openedOfferId: minPriceOffer.id,
          rfxItemId: minPriceOffer.rfxItemId,
          solRoundId: minPriceOffer.solRoundId,
          winnerPrice: minPriceOffer.price,
          nextRoundStartingPrice,
        });
      }

      const createdRoundAwards = roundAwardRepo.create(solRoundAwards);
      await Promise.all([
        roundAwardRepo.insert(createdRoundAwards),
        openedOfferRepo.upsert(rankedOffers, ['id']),
      ]);
    }

    async function openResponses(entityManager: EntityManager) {
      const solRegistrationRepo = entityManager.getRepository(SolRegistration);
      const openedOffersRepo = entityManager.getRepository(OpenedOffer);
      const openedResponseRepo = entityManager.getRepository(OpenedResponse);
      const openedItemResponseRepo =
        entityManager.getRepository(OpenedItemResponse);
      const roundRepo = entityManager.getRepository(SolRound);

      const registrations = await solRegistrationRepo.find({
        where: {
          rfxId: payload.rfxId,
          solOffers: {
            solRound: {
              round: payload.round,
            },
          },
          rfx: {
            items: {
              rfxProductInvitations: {
                status: In([
                  EInvitationStatus.ACCEPTED,
                  EInvitationStatus.COMPLY,
                ]),
              },
            },
          },
          status: ESolRegistrationStatus.REGISTERED,
        },
        relations: {
          rfx: {
            rfxBidProcedure: true,
            items: true,
          },
          solOffers: true,
          solItemResponses: true,
          solResponses: true,
        },
      });

      const responses = [];
      const itemResponses = [];
      const offers = [];

      for (const registration of registrations) {
        if (payload.round == 0) {
          const openedResponse = await decryptResponse(
            registration.solResponses,
            registration.salt,
          );
          const openedItemResponse = await decryptItemResponse(
            registration.solItemResponses,
            registration.salt,
          );

          responses.push(...openedResponse);
          itemResponses.push(...openedItemResponse);
        }

        const offer = await decryptOffers(
          registration.solOffers,
          registration.salt,
        );
        offers.push(...offer);
      }

      const createdResponse = openedResponseRepo.create(responses);
      const createdItemResponse = openedItemResponseRepo.create(itemResponses);
      const createdOffers = openedOffersRepo.create(offers);

      await Promise.all([
        openedResponseRepo.insert(createdResponse),
        openedItemResponseRepo.insert(createdItemResponse),
        openedOffersRepo.insert(createdOffers),
        roundRepo.update(
          { round: payload.round, rfxId: payload.rfxId },
          {
            status: ESolRoundStatus.COMPLETED,
          },
        ),
      ]);
    }

    async function decryptOffers(solOffers: SolOffer[], salt: string) {
      const openedOffers = [];
      for (const offer of solOffers) {
        const result = encryptionHelperService.decryptedData(
          offer.encryptedPrice,
          '123456',
          salt,
        );
        const tax = encryptionHelperService.decryptedData(
          offer.encryptedTax,
          '123456',
          salt,
        );

        const taxedPrice = +result * (1 + +tax / 100);

        openedOffers.push({
          ...offer,
          solOfferId: offer.id,
          taxedPrice,
          price: +result,
          tax: +tax,
          createdAt: undefined,
          updatedAt: undefined,
        });
      }
      return openedOffers;
    }

    async function decryptResponse(solResponses: SolResponse[], salt: string) {
      const openedResponse = [];
      for (const response of solResponses) {
        const result = encryptionHelperService.decryptedData(
          response.value,
          '123456',
          salt,
        );

        openedResponse.push({
          ...response,
          solResponseId: response.id,
          value: JSON.parse(result),
          createdAt: undefined,
          updatedAt: undefined,
        });
      }
      return openedResponse;
    }

    async function decryptItemResponse(
      solItemResponses: SolItemResponse[],
      salt: string,
    ) {
      const openedItemResponse = [];
      for (const itemResponse of solItemResponses) {
        const result = encryptionHelperService.decryptedData(
          itemResponse.value,
          '123456',
          salt,
        );

        openedItemResponse.push({
          ...itemResponse,
          solItemResponseId: itemResponse.id,
          value: JSON.parse(result),
          createdAt: undefined,
          updatedAt: undefined,
        });
      }
      return openedItemResponse;
    }
  }
}
