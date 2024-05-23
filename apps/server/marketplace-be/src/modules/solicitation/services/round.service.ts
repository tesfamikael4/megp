import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY, ExtraCrudService } from 'megp-shared-be';
import { RfxBidProcedure, SolRound } from 'src/entities';
import {
  EntityManager,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';
import { CreateRoundDto, RoundDto } from '../dtos/round.dto';
import { REQUEST } from '@nestjs/core';
import { ESolRoundStatus } from 'src/utils/enums';
import { SolOfferService } from './offer.service';

@Injectable()
export class SolRoundService extends ExtraCrudService<SolRound> {
  constructor(
    @InjectRepository(SolRound)
    private readonly solRoundRepository: Repository<SolRound>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly solOfferService: SolOfferService,
  ) {
    super(solRoundRepository);
  }

  async createZeroSolicitationRound(rfxBidProcedure: RfxBidProcedure) {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const start = new Date(rfxBidProcedure.invitationDate);
    const end = new Date(rfxBidProcedure.submissionDeadline);

    const roundItem: CreateRoundDto = {
      rfxId: rfxBidProcedure.rfxId,
      round: 0,
      end,
      start,
    };
    const round = this.solRoundRepository.create(roundItem);
    await entityManager.getRepository(SolRound).insert(round);
    return round;
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
    const now = new Date(Date.now());
    const round = await this.solRoundRepository.findOne({
      where: {
        rfxId,
        start: MoreThan(now),
      },
      order: {
        start: 'ASC',
      },
    });

    if (!round) throw new BadRequestException('Round not found');

    return round;
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
          roundStartingDate.setDate(
            roundStartingDate.getDate() + rfxBidProcedure.roundDuration,
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
