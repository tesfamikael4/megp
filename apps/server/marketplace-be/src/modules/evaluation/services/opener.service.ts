import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AwardNote,
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
import { CreateAwardNoteDTO } from 'src/modules/award/dtos/award-note.dto';
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
          try {
            const round = payload.round;

            const rfx = await checkValidRfx(entityManager);
            await openResponses(entityManager);

            const [items, rfxBidProcedure] = await filterItems(
              rfx,
              payload.round,
              entityManager,
            );

            if (round > 0) {
              // Solicitation (Round 0) Winners are calculated after evaluation approval
              await calculateRoundWinner(items, rfxBidProcedure, entityManager);
            }

            await endRound(entityManager);
          } catch (error) {
            if (error.status == 430) {
              Logger.error(error, 'OpenerService');
            } else throw error;
          }
        },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }

    async function filterItems(
      rfx: RFX,
      round: number,
      entityManager: EntityManager,
    ): Promise<[RFXItem[], RfxBidProcedure]> {
      const itemRepo = entityManager.getRepository(RFXItem);
      const rfxRepo = entityManager.getRepository(RFX);
      const roundRepo = entityManager.getRepository(SolRound);
      const awardNoteRepo = entityManager.getRepository(AwardNote);
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
          .andWhere('solRound.round = :round', { round })
          .andWhere('rfxProductInvitations.status IN (:...statuses)', {
            statuses: [EInvitationStatus.ACCEPTED, EInvitationStatus.COMPLY],
          })
          .getMany(),
        procedureRepo.findOne({
          where: { rfxId: payload.rfxId },
          select: {
            id: true,
            deltaPercentage: true,
            submissionDeadline: true,
            round: true,
          },
        }),
      ]);

      if (validItems.length == 0) {
        const awardNote: CreateAwardNoteDTO = awardNoteRepo.create({
          name: rfx.name,
          prId: rfx.prId,
          rfxId: rfx.id,
          description: rfx.description,
          procurementReferenceNumber: rfx.procurementReferenceNumber,
          organizationId: rfx.organizationId,
          organizationName: rfx.organizationName,
        });
        await Promise.all([
          awardNoteRepo.insert(awardNote),
          payload.round == 0
            ? itemRepo.update(
                {
                  rfxId: payload.rfxId,
                },
                {
                  status: ERfxItemStatus.ENDED,
                },
              )
            : Promise.resolve(),
          rfxRepo.update(payload.rfxId, {
            status: ERfxStatus.ENDED,
          }),
          roundRepo.update(
            { round: MoreThanOrEqual(payload.round), rfxId: rfx.id },
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
        rfxRepo.findOne({
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
      return activeRfx;
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

      const nextRound = await roundRepo.exists({
        where: {
          round: payload.round + 1,
          rfxId: payload.rfxId,
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
      const endedItems = [];

      for (const item of items) {
        if (item.openedOffers.length == 0) {
          endedItems.push(item.id);
          continue;
        }
        const sortedOffers = item.openedOffers.sort(
          (a, b) => a.calculatedPrice - b.calculatedPrice,
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
        endedItems.length > 0
          ? itemRepo.update(endedItems, { status: ERfxItemStatus.ENDED })
          : Promise.resolve(),
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

        const calculatedPrice = +result * (1 + +tax / 100);

        openedOffers.push({
          ...offer,
          solOfferId: offer.id,
          calculatedPrice,
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
