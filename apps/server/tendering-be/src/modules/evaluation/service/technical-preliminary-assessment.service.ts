import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, In, Repository, createQueryBuilder } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { REQUEST } from '@nestjs/core';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TeamMember } from 'src/entities/team-member.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { BidOpeningChecklist, SpdOpeningChecklist } from 'src/entities';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';

@Injectable()
export class TechnicalPreliminaryAssessmentService extends ExtraCrudService<TechnicalPreliminaryAssessment> {
  constructor(
    @InjectRepository(TechnicalPreliminaryAssessment)
    private readonly technicalPreliminaryAssessmentRepository: Repository<TechnicalPreliminaryAssessment>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(technicalPreliminaryAssessmentRepository);
  }

  async openingPassedBidders(lotId: string, q: string, req: any) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the spd compliance for each bidder.
    //Todo check if the opener is in the team
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const teamMember = this.isTeamMember(lotId, req.user.userId);
    if (!teamMember) {
      throw new Error('You are not a team member');
    }

    const query = decodeCollectionQuery(q);
    const [bidders, spdChecklistCount] = await Promise.all([
      manager
        .getRepository(BidOpeningChecklist)
        .createQueryBuilder('BidOpeningChecklist')
        .select('BidOpeningChecklist.bidderId', 'bidderId')
        .addSelect('COUNT(*)', 'count')
        // .where("BidOpeningChecklist.isTeamLead = :isTeamLead", { isTeamLead: true })
        .andWhere('BidOpeningChecklist.checked = :checked', { checked: true })
        .andWhere('BidOpeningChecklist.lotId = :lotId', { lotId })
        .groupBy('BidOpeningChecklist.bidderId')
        .orderBy('BidOpeningChecklist.bidderId')
        .getRawMany(),

      manager.getRepository(SpdOpeningChecklist).count({
        where: {
          spd: {
            tenders: {
              tender: {
                lots: {
                  id: lotId,
                },
              },
            },
          },
        },
      }),
    ]);

    const openingPassedBidders = [];
    bidders.forEach((bidder) => {
      if (bidder.count == spdChecklistCount) {
        openingPassedBidders.push(bidder.bidderId);
      }
    });
    const passed = await manager.getRepository(BidRegistration).find({
      where: {
        bidderId: In(openingPassedBidders),
        bidRegistrationDetails: {
          lotId,
        },
      },
      select: {
        bidderId: true,
        bidderName: true,
      },
    });
    return passed;
  }

  async isTeamMember(lotId: string, memberId: string): Promise<boolean> {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    return await manager.getRepository(TeamMember).exists({
      where: {
        team: {
          teamType: TeamRoleEnum.TECHNICAL_EVALUATOR,
          tender: {
            lots: {
              id: lotId,
            },
          },
          teamMembers: {
            personnelId: memberId,
          },
        },
      },
    });
  }
}
