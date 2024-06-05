import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  OpenedOffer,
  RFX,
  RFXItem,
  RfxBidProcedure,
  RfxProductInvitation,
  SolOffer,
  SolRound,
  SolRoundAward,
} from 'src/entities';
import { EvalAssessment } from 'src/entities/eval-assessment.entity';
import { OpenerSerivice } from 'src/modules/evaluation/services/opener.service';
import {
  CreateRoundDto,
  RoundDto,
} from 'src/modules/solicitation/dtos/round.dto';
import {
  EInvitationStatus,
  ERfxStatus,
  ESolOfferStatus,
  ESolRoundStatus,
  EvaluationResponse,
} from 'src/utils/enums';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { DataSource, EntityManager, In, MoreThanOrEqual, Not } from 'typeorm';

@Injectable()
export class WorkflowHandlerService {
  constructor(
    private dataSource: DataSource,
    private readonly amqpConnection: AmqpConnection,
    private readonly schedulerService: SchedulerService,
    private readonly openerService: OpenerSerivice,
  ) {}

  emitEvent(exchange: string, routingKey: string, payload: any) {
    this.amqpConnection.publish(exchange, routingKey, payload);
  }

  async handleEvaluationApproval(payload: any, entityManager: EntityManager) {
    try {
      await entityManager.queryRunner.manager.connection.transaction(
        async (entityManager) => {
          const approvalStatus =
            payload.status == 'Approved' ? 'APPROVED' : 'REJECTED';
          const evalAssessmentRepo =
            entityManager.getRepository(EvalAssessment);
          const rfxRepo = entityManager.getRepository(RFX);
          const productInvitationRepo =
            entityManager.getRepository(RfxProductInvitation);

          if (approvalStatus == 'APPROVED') {
            const [assessments, rfxExists] = await Promise.all([
              evalAssessmentRepo.find({
                where: {
                  rfxId: payload.itemId,
                  isTeamAssessment: true,
                },
                select: {
                  id: true,
                  qualified: true,
                  solRegistration: {
                    id: true,
                    rfxProductInvitations: {
                      id: true,
                    },
                  },
                },
                relations: {
                  solRegistration: {
                    rfxProductInvitations: true,
                  },
                },
              }),
              rfxRepo.exists({
                where: {
                  id: payload.itemId,
                  status: ERfxStatus.SUBMITTED_EVALUATION,
                },
              }),
            ]);

            if (!rfxExists)
              throw new BadRequestException(
                'RFQ on submitted evaluation status not found',
              );

            const compliedAssessmentsId = assessments
              .filter((ev) => ev.qualified == EvaluationResponse.COMPLY)
              .flatMap((item) =>
                item.solRegistration.rfxProductInvitations.map(
                  (invitation) => invitation.id,
                ),
              );

            const notCompliedAssessmentsId = assessments
              .filter((ev) => ev.qualified == EvaluationResponse.NOT_COMPLY)
              .flatMap((item) =>
                item.solRegistration.rfxProductInvitations.map(
                  (invitation) => invitation.id,
                ),
              );

            await Promise.all([
              productInvitationRepo.update(
                {
                  id: In(compliedAssessmentsId),
                },
                {
                  status: EInvitationStatus.COMPLY,
                },
              ),
              productInvitationRepo.update(
                {
                  id: In(notCompliedAssessmentsId),
                },
                {
                  status: EInvitationStatus.NOT_COMPLY,
                },
              ),
            ]);

            await this.calculateRoundWinner(payload.itemId, 0, entityManager);

            const rounds = await this.scheduleNextRounds(
              payload.itemId,
              entityManager,
            );
            if (Array.isArray(rounds)) {
              if (rounds.length == 0) {
                await rfxRepo.update(payload.itemId, {
                  status: ERfxStatus.ENDED,
                });
              } else {
                await rfxRepo.update(payload.itemId, {
                  status: ERfxStatus.AUCTION,
                });

                this.schedulerService.scheduleWithEncryption;
              }
            }
            await this.scheduleRoundOpening(payload.itemId, entityManager);
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async handleRfxApproval(payload: any, entityManager: EntityManager) {
    try {
      await entityManager.queryRunner.manager.connection.transaction(
        async (entityManager) => {
          const rfxRepo = entityManager.getRepository(RFX);
          const rfxProcedureRepo = entityManager.getRepository(RfxBidProcedure);

          const rfx = await rfxRepo.findOne({
            where: {
              id: payload.itemId,
              status: ERfxStatus.SUBMITTED,
            },
            relations: {
              rfxBidProcedure: true,
            },
          });

          if (!rfx) return Logger.error(`RFX ${payload?.itemId} not found`);

          const status = payload.status == 'Approved' ? 'APPROVED' : 'REJECTED';

          await this.updateRfxChildrenStatus(rfx.id, status, entityManager);
          await rfxProcedureRepo.update(
            {
              id: rfx.rfxBidProcedure.id,
            },
            {
              invitationDate: new Date(Date.now()),
            },
          );

          if (rfx.isOpen) {
            const approvePayload = {
              ...rfx,
              objectType: 'RFX',
            };
            this.emitEvent('rms', 'record-notice', approvePayload);
          }

          if (status == 'APPROVED') {
            await this.createZeroSolicitationRound(
              rfx.rfxBidProcedure,
              entityManager,
            );
            await this.scheduleRoundOpening(rfx.id, entityManager);
          }
        },
      );
    } catch (error) {
      Logger.log(error);
    }
  }

  async scheduleNextRounds(rfxId: string, entityManager: EntityManager) {
    const rfxBidProcedure = await entityManager
      .getRepository(RfxBidProcedure)
      .findOne({
        where: {
          rfxId,
        },
      });

    const roundItems = this.createRoundFromProcedure(rfxBidProcedure);
    const round = roundItems.map((item: any, index: number) => {
      if (index == 0) item.status == ESolRoundStatus.STARTED;
      item.rfxId = rfxBidProcedure.rfxId;
      return item;
    });
    const solRoundRepo = entityManager.getRepository(SolRound);
    const rounds = solRoundRepo.create(round);
    await solRoundRepo.insert(rounds);
    return rounds;
  }

  async createZeroSolicitationRound(
    rfxBidProcedure: RfxBidProcedure,
    entityManager: EntityManager,
  ) {
    const roundRepo = entityManager.getRepository(SolRound);

    const start = rfxBidProcedure.invitationDate || new Date(Date.now());
    const end = rfxBidProcedure.submissionDeadline;

    const roundItem: CreateRoundDto = {
      rfxId: rfxBidProcedure.rfxId,
      round: 0,
      end,
      start,
      status: ESolRoundStatus.STARTED,
    };
    const round = roundRepo.create(roundItem);
    await roundRepo.insert(round);
    return round;
  }

  async updateRfxChildrenStatus(
    rfxId: string,
    status: any,
    entityManager: EntityManager,
  ) {
    const [, , rfxItems] = await Promise.all([
      entityManager.getRepository(RFX).update(rfxId, {
        status,
      }),
      entityManager.getRepository(RFXItem).update(
        { rfxId },
        {
          status,
        },
      ),
      entityManager.getRepository(RFXItem).find({
        where: {
          rfxId: rfxId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    const rfxItemIds = rfxItems.map((item) => item.id);

    await entityManager.getRepository(RfxProductInvitation).update(
      {
        rfxItemId: In(rfxItemIds),
      },
      {
        status,
      },
    );
  }

  async scheduleRoundOpening(rfxId: string, entityManager: EntityManager) {
    try {
      const roundRepo = entityManager.getRepository(SolRound);
      const rounds = await roundRepo.find({
        where: {
          rfxId,
          status: Not(
            In([ESolRoundStatus.CANCELLED, ESolRoundStatus.COMPLETED]),
          ),
          end: MoreThanOrEqual(new Date(Date.now())),
        },
      });

      if (rounds.length == 0)
        throw new BadRequestException(
          `Round for rfx with id ${rfxId} is not found`,
        );

      for (const round of rounds) {
        const payload = {
          round: round.round,
          rfxId,
        };

        await this.schedulerService.scheduleWithEncryption(
          this.openerService.openAndEvaluateResponses,
          round.end,
          payload,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async calculateRoundWinner(
    rfxId: string,
    round: number,
    entityManager: EntityManager,
  ) {
    const rfxItemsRepo = entityManager.getRepository(RFXItem);
    const roundAwardRepo = entityManager.getRepository(SolRoundAward);
    const bidProcedureRepo = entityManager.getRepository(RfxBidProcedure);

    const [items, bidProcedure] = await Promise.all([
      rfxItemsRepo.find({
        where: {
          rfxId,
          openedOffers: {
            solRound: {
              round,
            },
          },
        },
        relations: {
          openedOffers: true,
        },
      }),
      bidProcedureRepo.findOne({
        where: {
          rfxId,
        },
        select: {
          id: true,
          deltaPercentage: true,
        },
      }),
    ]);
    const solRoundAwards = [];
    for (const item of items) {
      const minPriceOffer = item.openedOffers.reduce(
        (minOffer, currentOffer) => {
          return currentOffer.price < minOffer.price ? currentOffer : minOffer;
        },
      );

      const decreament =
        (minPriceOffer.price * bidProcedure.deltaPercentage) / 100;
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

  private createRoundFromProcedure(rfxBidProcedure: RfxBidProcedure) {
    const rounds: RoundDto[] = [];

    for (let i = 0; i < rfxBidProcedure.round; i++) {
      let roundStartingDate: Date, roundEndDate: Date;
      if (i == 0) {
        roundStartingDate = new Date();

        roundEndDate = new Date(
          new Date().setMinutes(
            roundStartingDate.getMinutes() + rfxBidProcedure.roundDuration,
          ),
        );
      } else {
        const previousEndDate = new Date(rounds[i - 1].end);

        roundStartingDate = new Date(
          previousEndDate.setMinutes(
            previousEndDate.getMinutes() + rfxBidProcedure.idleTime,
          ),
        );

        roundEndDate = new Date(roundStartingDate);
        roundEndDate.setMinutes(
          roundEndDate.getMinutes() + rfxBidProcedure.roundDuration,
        );
      }
      rounds.push({
        round: i + 1,
        start: roundStartingDate,
        end: roundEndDate,
      });
    }
    return rounds;
  }
}
