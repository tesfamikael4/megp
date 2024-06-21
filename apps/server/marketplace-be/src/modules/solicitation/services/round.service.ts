import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { RfxBidProcedure, SolRound } from 'src/entities';
import { EntityManager, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateRoundDto, RoundDto } from '../dtos/round.dto';
import { REQUEST } from '@nestjs/core';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { OpenerService } from 'src/modules/evaluation/services/opener.service';
import { ESolRoundStatus } from 'src/utils/enums';
import currentTime from 'src/utils/services/time-provider';

@Injectable()
export class SolRoundService extends ExtraCrudService<SolRound> {
  constructor(
    @InjectRepository(SolRound)
    private readonly solRoundRepository: Repository<SolRound>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly schedulerService: SchedulerService,
    private readonly openerService: OpenerService,
  ) {
    super(solRoundRepository);
  }

  async endedRounds(rfxId: string) {
    const round = await this.solRoundRepository.findOne({
      where: {
        rfxId,
        status: ESolRoundStatus.COMPLETED,
      },
      order: {
        round: 'DESC',
      },
      select: {
        id: true,
        round: true,
      },
    });

    return round.round;
  }

  async createZeroSolicitationRound(rfxBidProcedure: RfxBidProcedure) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const startingTime = rfxBidProcedure.invitationDate;
    const endingTime = rfxBidProcedure.submissionDeadline;

    const roundItem: CreateRoundDto = {
      rfxId: rfxBidProcedure.rfxId,
      round: 0,
      endingTime,
      startingTime,
      status: ESolRoundStatus.PENDING,
    };
    const round = this.solRoundRepository.create(roundItem);
    await entityManager.getRepository(SolRound).insert(round);
    return round;
  }

  async scheduleRoundOpening(rfxId: string, roundNumber: number) {
    try {
      const round = await this.solRoundRepository.findOne({
        where: {
          rfxId,
          round: roundNumber,
        },
      });

      if (!round)
        throw new BadRequestException(
          `Round ${roundNumber} for rfx with id ${rfxId} is not found`,
        );

      const payload = {
        round: roundNumber,
        rfxId,
      };

      // TODO: REVERT: GMT+03:00
      const roundEnding = new Date(round.endingTime);
      roundEnding.setHours(
        roundEnding.getHours() + +process.env.TIMEZONE_OFFSET || 0,
      );

      await this.schedulerService.scheduleWithEncryption(
        this.openerService.openAndEvaluateResponses,
        roundEnding,
        payload,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async scheduleNextRounds(rfxBidProcedure: RfxBidProcedure) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const roundItems = this.createRoundFromProcedure(rfxBidProcedure);
    const round = roundItems.map((item: any) => {
      item.rfxId = rfxBidProcedure.rfxId;
      return item;
    });
    const solRoundRepo = entityManager.getRepository(SolRound);
    const rounds = solRoundRepo.create(round);
    await solRoundRepo.insert(rounds);
    return rounds;
  }

  async getCurrentRound(rfxId: string) {
    const now = new Date();

    const round = await this.solRoundRepository.findOne({
      where: {
        rfxId,
        startingTime: LessThan(now),
        endingTime: MoreThan(now),
      },
      order: {
        startingTime: 'ASC',
      },
    });

    if (!round) throw new BadRequestException('Round not found');

    return round;
  }

  async cancelPendingRounds(rfxId: string) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const rounds = await entityManager.getRepository(SolRound).exists({
      where: {
        rfxId,
        status: ESolRoundStatus.PENDING,
      },
    });

    if (rounds) {
      await entityManager.getRepository(SolRound).update(
        {
          rfxId,
        },
        {
          status: ESolRoundStatus.CANCELLED,
        },
      );
    }

    return rounds;
  }

  private createRoundFromProcedure(rfxBidProcedure: RfxBidProcedure) {
    const rounds: RoundDto[] = [];
    const openingDate = new Date(rfxBidProcedure.openingDate);

    const firstRoundStartingDate = new Date(
      openingDate.setDate(openingDate.getDate() + rfxBidProcedure.idleTime),
    );

    for (let i = 0; i < rfxBidProcedure.round; i++) {
      let roundStartingDate: Date, roundEndDate: Date;
      if (i == 0) {
        roundStartingDate = firstRoundStartingDate;

        roundEndDate = new Date(
          firstRoundStartingDate.setDate(
            firstRoundStartingDate.getDate() + rfxBidProcedure.roundDuration,
          ),
        );
      } else {
        const previousEndDate = new Date(rounds[i - 1].endingTime);

        roundStartingDate = new Date(
          previousEndDate.setMinutes(
            previousEndDate.getMinutes() + rfxBidProcedure.idleTime,
          ),
        );

        roundEndDate = new Date(roundStartingDate);
        roundEndDate.setMinutes(
          roundEndDate.getMinutes() + rfxBidProcedure.roundDuration,
        );
        roundEndDate;
      }
      rounds.push({
        round: i + 1,
        startingTime: roundStartingDate,
        endingTime: roundEndDate,
      });
    }
    return rounds;
  }
}
