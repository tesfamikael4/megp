import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  OpenedItemResponse,
  OpenedOffer,
  OpenedResponse,
  RFX,
  RFXItem,
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
  ERfxStatus,
  ESolOfferStatus,
  ESolRegistrationStatus,
  ESolRoundStatus,
} from 'src/utils/enums';
import { EncryptionHelperService } from 'src/utils/services/encryption-helper.service';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { DataSource, EntityManager, In } from 'typeorm';

@Injectable()
export class OpenerSerivice {
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
          const rfxId = payload.rfxId;

          await checkValidRfx();
          await decryptResponses();

          if (round > 0) {
            await calculateRoundWinner();
          }
          await endRound();

          async function checkValidRfx() {
            const rfxRepo = entityManager.getRepository(RFX);

            const activeRfx = await rfxRepo.exists({
              where: {
                status: In([ERfxStatus.APPROVED, ERfxStatus.AUCTION]),
                id: rfxId,
              },
            });

            if (!activeRfx) {
              Logger.error(`No Active RFQ found for this RFQ id ${rfxId}`);
              return;
            }
          }
          async function endRound() {
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

          async function calculateRoundWinner() {
            const itemRepo = entityManager.getRepository(RFXItem);
            const roundAwardRepo = entityManager.getRepository(SolRoundAward);
            const rfxRepo = entityManager.getRepository(RFX);

            const items = await itemRepo.find({
              where: {
                rfxId: payload.rfxId,
                rfxProductInvitations: {
                  status: In([
                    EInvitationStatus.ACCEPTED,
                    EInvitationStatus.COMPLY,
                  ]),
                },
                openedOffers: {
                  solRound: {
                    round: payload.round,
                  },
                },
              },
              relations: {
                openedOffers: true,
                rfx: {
                  rfxBidProcedure: true,
                },
              },
            });

            if (items.length == 0) {
              await rfxRepo.update(payload.rfxId, {
                status: ERfxStatus.ENDED,
              });
              return;
            }

            const solRoundAwards = [];
            const delta = items[0].rfx.rfxBidProcedure.deltaPercentage;

            for (const item of items) {
              const minPriceOffer = item.openedOffers.reduce(
                (minOffer, currentOffer) => {
                  return currentOffer.price < minOffer.price
                    ? currentOffer
                    : minOffer;
                },
              );

              const decreament = (minPriceOffer.price * delta) / 100;
              const nextRoundStartingPrice = minPriceOffer.price - decreament;

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
            await roundAwardRepo.insert(createdRoundAwards);
          }

          async function decryptResponses() {
            const solRegistrationRepo =
              entityManager.getRepository(SolRegistration);
            const openedOffersRepo = entityManager.getRepository(OpenedOffer);
            const openedResponseRepo =
              entityManager.getRepository(OpenedResponse);
            const openedItemResponseRepo =
              entityManager.getRepository(OpenedItemResponse);
            const roundRepo = entityManager.getRepository(SolRound);

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
              if (round == 0) {
                const openedResponse = [];
                for (const response of registration.solResponses) {
                  const result = encryptionHelperService.decryptedData(
                    response.value,
                    '123456',
                    registration.salt,
                  );

                  openedResponse.push({
                    ...response,
                    solResponseId: response.id,
                    value: JSON.parse(result),
                    createdAt: undefined,
                    updatedAt: undefined,
                  });
                }

                const openedItemResponse = [];
                for (const itemResponse of registration.solItemResponses) {
                  const result = encryptionHelperService.decryptedData(
                    itemResponse.value,
                    '123456',
                    registration.salt,
                  );

                  openedItemResponse.push({
                    ...itemResponse,
                    solItemResponseId: itemResponse.id,
                    value: JSON.parse(result),
                    createdAt: undefined,
                    updatedAt: undefined,
                  });
                }

                responses.push(...openedResponse);
                itemResponses.push(...openedItemResponse);
              }

              // Decrypt offers
              const openedOffers = [];
              for (const offer of registration.solOffers) {
                const result = encryptionHelperService.decryptedData(
                  offer.encryptedPrice,
                  '123456',
                  registration.salt,
                );
                const tax = encryptionHelperService.decryptedData(
                  offer.encryptedTax,
                  '123456',
                  registration.salt,
                );

                openedOffers.push({
                  ...offer,
                  solOfferId: offer.id,
                  price: +result,
                  tax: +tax,
                  createdAt: undefined,
                  updatedAt: undefined,
                });
              }
              offers.push(...openedOffers);
            }

            const createdResponse = openedResponseRepo.create(responses);
            const createdItemResponse =
              openedItemResponseRepo.create(itemResponses);
            const createdOffers = openedOffersRepo.create(offers);

            await Promise.all([
              openedResponseRepo.insert(createdResponse),
              openedItemResponseRepo.insert(createdItemResponse),
              openedOffersRepo.insert(createdOffers),
              roundRepo.update(
                { round, rfxId },
                {
                  status: ESolRoundStatus.COMPLETED,
                },
              ),
            ]);
          }
        },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }
}
