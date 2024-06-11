import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  OpenedOffer,
  RFX,
  RFXItem,
  RfxBidProcedure,
  RfxProductInvitation,
  SolOffer,
  SolRound,
  SolRoundAward,
  TeamMember,
} from 'src/entities';
import { EvalAssessment } from 'src/entities/eval-assessment.entity';
import { OpenerService } from 'src/modules/evaluation/services/opener.service';
import {
  CreateRoundDto,
  RoundDto,
} from 'src/modules/solicitation/dtos/round.dto';
import {
  EInvitationStatus,
  ERfxItemStatus,
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
    private readonly openerService: OpenerService,
  ) {}

  emitEvent(exchange: string, routingKey: string, payload: any) {
    this.amqpConnection.publish(exchange, routingKey, payload);
  }

  async handleEvaluationApproval(payload: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.connection.transaction(
        async (entityManager) => {
          if (payload.status == 'Approved') {
            await this.approveEvaluation(payload.itemId, entityManager);
          } else {
            await this.updateEvaluationVersions(payload.itemId, entityManager);
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
    items: RFXItem[],
    delta: number,
    entityManager: EntityManager,
  ) {
    const roundAwardRepo = entityManager.getRepository(SolRoundAward);
    const openedOfferRepo = entityManager.getRepository(OpenedOffer);
    const itemRepo = entityManager.getRepository(RFXItem);

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
        (a, b) => a.calculatedPrice - b.calculatedPrice,
      );

      const offerRank = sortedOffers.map((offer, index) => ({
        ...offer,
        updatedAt: undefined,
        rank: index + 1,
      }));
      rankedOffers.push(...offerRank);

      const minPriceOffer = sortedOffers[0];

      const decrement = (minPriceOffer.price * delta) / 100;
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

  private async updateEvaluationVersions(
    rfxId: string,
    entityManager: EntityManager,
  ) {
    const rfxRepo = entityManager.getRepository(RFX);
    const teamMembersRepo = entityManager.getRepository(TeamMember);

    const rfx = await rfxRepo.findOne({
      where: {
        id: rfxId,
      },
      select: {
        id: true,
        version: true,
      },
    });
    await Promise.all([
      rfxRepo.update(rfxId, {
        version: rfx.version + 1,
        status: ERfxStatus.EVALUATION,
      }),
      teamMembersRepo.update(
        {
          rfxId,
        },
        {
          hasEvaluated: false,
        },
      ),
    ]);
  }
  private async approveEvaluation(rfxId: string, entityManager: EntityManager) {
    const evalAssessmentRepo = entityManager.getRepository(EvalAssessment);
    const rfxRepo = entityManager.getRepository(RFX);
    const productInvitationRepo =
      entityManager.getRepository(RfxProductInvitation);

    const [assessments, rfxExists] = await Promise.all([
      evalAssessmentRepo.find({
        where: {
          rfxId,
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
          id: rfxId,
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

    if (compliedAssessmentsId.length > 0) {
      productInvitationRepo.update(
        {
          id: In(compliedAssessmentsId),
        },
        {
          status: EInvitationStatus.COMPLY,
        },
      );
    }
    if (notCompliedAssessmentsId.length > 0) {
      productInvitationRepo.update(
        {
          id: In(notCompliedAssessmentsId),
        },
        {
          status: EInvitationStatus.NOT_COMPLY,
        },
      );
    }

    const [items, procedure] = await this.filterItems(rfxId, 0, entityManager);
    await this.calculateRoundWinner(
      items,
      procedure.deltaPercentage,
      entityManager,
    );

    const rounds = await this.scheduleNextRounds(rfxId, entityManager);
    if (Array.isArray(rounds)) {
      if (rounds.length == 0) {
        await rfxRepo.update(rfxId, {
          status: ERfxStatus.ENDED,
        });
      } else {
        await rfxRepo.update(rfxId, {
          status: ERfxStatus.AUCTION,
        });
      }
    }
    await this.scheduleRoundOpening(rfxId, entityManager);
  }

  private async filterItems(
    rfxId: string,
    round: number,
    entityManager: EntityManager,
  ): Promise<[RFXItem[], RfxBidProcedure]> {
    const itemRepo = entityManager.getRepository(RFXItem);
    const rfxRepo = entityManager.getRepository(RFX);
    const roundRepo = entityManager.getRepository(SolRound);
    const procedureRepo = entityManager.getRepository(RfxBidProcedure);

    const [validItems, rfxBidProcedure] = await Promise.all([
      itemRepo
        .createQueryBuilder('rfx_items')
        .where('rfx_items.rfxId = :rfxId', { rfxId })
        .andWhere('rfx_items.status = :status', {
          status: ERfxItemStatus.APPROVED,
        })
        .leftJoinAndSelect('rfx_items.openedOffers', 'openedOffers')
        .leftJoin('openedOffers.solRound', 'solRound')
        .leftJoin('openedOffers.rfxProductInvitation', 'rfxProductInvitations')
        .where('solRound.round = :round', { round })
        .andWhere('rfxProductInvitations.status IN (:...status)', {
          status: [EInvitationStatus.ACCEPTED, EInvitationStatus.COMPLY],
        })
        .getMany(),
      procedureRepo.findOne({
        where: { rfxId },
        select: { id: true, deltaPercentage: true },
      }),
    ]);

    if (validItems.length == 0) {
      await Promise.all([
        rfxRepo.update(rfxId, {
          status: ERfxStatus.ENDED,
        }),
        roundRepo.update(
          { round: MoreThanOrEqual(round), rfxId },
          {
            status: ESolRoundStatus.CANCELLED,
          },
        ),
      ]);
      throw new NotFoundException(
        `No valid items found for this RFQ id ${rfxId}`,
      );
    }

    return [validItems, rfxBidProcedure];
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
