/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolRound } from 'src/entities';
import { ESolRoundStatus } from 'src/utils/enums';
import { SchedulerService } from 'src/utils/services/scheduler.service';
import { In, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { OpenerService } from './opener.service';

@Injectable()
export class ReSchedulerService implements OnModuleInit {
  constructor(
    @InjectRepository(SolRound)
    private readonly solRoundRepository: Repository<SolRound>,
    private readonly schedulerService: SchedulerService,
    private readonly openerService: OpenerService,
  ) {}

  async onModuleInit() {
    const now = new Date(Date.now());

    const rounds = await this.solRoundRepository.find({
      where: {
        end: MoreThanOrEqual(now),
        status: In([ESolRoundStatus.STARTED, ESolRoundStatus.PENDING]),
      },
    });

    for (const round of rounds) {
      const end = new Date(round.end);
      if (!end) continue;

      const payload = { rfxId: round.rfxId, round: round.round };

      await this.schedulerService.scheduleWithEncryption(
        this.openerService.openAndEvaluateResponses,
        end,
        payload,
      );
    }
  }
}
