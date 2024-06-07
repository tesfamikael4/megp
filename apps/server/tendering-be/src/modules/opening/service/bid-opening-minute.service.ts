import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidOpeningMinute } from 'src/entities/bid-opening-minute.entity';
import { BidRegistrationService } from 'src/modules/bid/service/bid-registration.service';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { TeamMember } from 'src/entities/team-member.entity';
import { BidOpeningChecklistAssessmentDetail } from 'src/entities';
import { BidOpeningChecklistAssessment } from 'src/entities/bid-opening-checklist-assessment.entity';

@Injectable()
export class BidOpeningMinuteService extends ExtraCrudService<BidOpeningMinute> {
  constructor(
    @InjectRepository(BidOpeningMinute)
    private readonly bidOpeningMinuteRepository: Repository<BidOpeningMinute>,
    private readonly bidRegistrationService: BidRegistrationService,

    @Inject(REQUEST) private request: Request,
  ) {
    super(bidOpeningMinuteRepository);
  }

  async bidOpeningMinuteReport(lotId: string) {
    const query = decodeCollectionQuery('');
    const bidders =
      await this.bidRegistrationService.getSubmittedBiddersByLotId(
        lotId,
        query,
      );

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [opener, bidOpeningChecklist] = await Promise.all([
      manager.getRepository(TeamMember).find({
        where: {
          team: {
            lot: {
              id: lotId,
            },
          },
        },
      }),

      manager.getRepository(BidOpeningChecklistAssessment).find({
        where: {
          lotId,
        },
      }),
    ]);
    return { bidOpeningChecklist, opener, bidders };
  }
}
