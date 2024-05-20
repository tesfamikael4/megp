import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { RfxBidProcedure, SolRound } from 'src/entities';
import { MoreThan, Repository } from 'typeorm';
import { RoundDto } from '../dtos/round.dto';

@Injectable()
export class SolRoundService extends ExtraCrudService<SolRound> {
  constructor(
    @InjectRepository(SolRound)
    private readonly solRoundRepository: Repository<SolRound>,
  ) {
    super(solRoundRepository);
  }

  async scheduleRounds(rfxBidProcedure: RfxBidProcedure) {
    const roundItems = this.createRoundFromProcedure(rfxBidProcedure);
    const round = roundItems.map((item: any) => {
      item.rfxId = rfxBidProcedure.rfxId;
      return item;
    });

    const rounds = this.solRoundRepository.create(round);
    await this.solRoundRepository.insert(rounds);
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

    for (let i = 0; i < rfxBidProcedure.round; i++) {
      let roundStartingDate;

      if (i == 0) {
        roundStartingDate = new Date(rfxBidProcedure.openingDate);
      } else {
        const previousEndDate = new Date(rounds[i - 1].end);

        roundStartingDate = new Date(
          previousEndDate.setMinutes(
            previousEndDate.getMinutes() + rfxBidProcedure.roundDuration, // ?
          ),
        );
      }

      const roundEndDate = new Date(roundStartingDate);
      roundEndDate.setMinutes(
        roundEndDate.getMinutes() + rfxBidProcedure.roundDuration,
      );

      rounds.push({
        round: i + 1,
        start: roundStartingDate,
        end: roundEndDate as any,
      });
    }
    return rounds;
  }
}
