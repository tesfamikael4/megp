import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraCrudService } from 'megp-shared-be';
import { SolRound, SolRoundAward } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SolRoundAwardService extends ExtraCrudService<SolRoundAward> {
  constructor(
    @InjectRepository(SolRoundAward)
    private readonly roundAwardRepository: Repository<SolRoundAward>,
    @InjectRepository(SolRound)
    private readonly solRoundRepository: Repository<SolRound>,
  ) {
    super(roundAwardRepository);
  }
}
