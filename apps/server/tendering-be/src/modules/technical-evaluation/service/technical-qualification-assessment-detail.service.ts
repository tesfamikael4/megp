import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TechnicalQualificationAssessmentDetail } from 'src/entities/technical-qualification-assessment-detail.entity';
import { CollectionQuery } from 'src/shared/collection-query';

@Injectable()
export class TechnicalQualificationAssessmentDetailService extends ExtraCrudService<TechnicalQualificationAssessmentDetail> {
  constructor(
    @InjectRepository(TechnicalQualificationAssessmentDetail)
    private readonly technicalQualificationAssessmentDetailRepository: Repository<TechnicalQualificationAssessmentDetail>,
  ) {
    super(technicalQualificationAssessmentDetailRepository);
  }

  // async openingPassedBidders(
  //   lotId: string,
  //   isTeam: string,
  //   query: CollectionQuery,
  //   req: any,
  // ) {
  //   // Functionality: Checks if the current user (opener) is part of the team for the given lot,
  //   // then checks if the opener has completed the spd compliance for each bidder.
  //   //Todo check if the opener is in the team
  //   const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
  //   const evaluatorId = req.user.userId;
  //   const isTeamAssessment = isTeam == 'teamLeader' ? true : false;

  //   // const teamMember = this.isTeamMember(lotId, req.user.userId);
  //   // if (!teamMember) {
  //   //   throw new Error('You are not a team member');
  //   // }

  //   const [bidders, spdChecklistCount] = await Promise.all([
  //     manager
  //       .getRepository(BidOpeningChecklist)
  //       .createQueryBuilder('BidOpeningChecklist')
  //       .select('BidOpeningChecklist.bidderId', 'bidderId')
  //       .addSelect('COUNT(*)', 'count')
  //       .where('BidOpeningChecklist.isTeamLead = :isTeamLead', {
  //         isTeamLead: true,
  //       })
  //       .andWhere('BidOpeningChecklist.checked = :checked', { checked: true })
  //       .andWhere('BidOpeningChecklist.lotId = :lotId', { lotId })
  //       .groupBy('BidOpeningChecklist.bidderId')
  //       .orderBy('BidOpeningChecklist.bidderId')
  //       .getRawMany(),

  //     manager.getRepository(SpdOpeningChecklist).count({
  //       where: {
  //         spd: {
  //           tenderSpds: {
  //             tender: {
  //               lots: {
  //                 id: lotId,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     }),
  //   ]);

  //   const openingPassedBidders = [];
  //   bidders.forEach((bidder) => {
  //     if (bidder.count == spdChecklistCount) {
  //       openingPassedBidders.push(bidder.bidderId);
  //     }
  //   });
  //   const [passed, spdChecklist] = await Promise.all([
  //     manager.getRepository(BidRegistration).find({
  //       where: {
  //         bidderId: In(openingPassedBidders),
  //         bidRegistrationDetails: {
  //           lotId,
  //         },
  //       },
  //       select: {
  //         bidderId: true,
  //         bidderName: true,
  //       },
  //     }),
  //     manager.getRepository(SpdPreliminaryEvaluation).find({
  //       where: {
  //         spd: {
  //           tenderSpds: {
  //             tender: {
  //               lots: {
  //                 id: lotId,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     }),
  //   ]);

  //   const response: {
  //     items: { bidder: BidRegistration; status: string }[];
  //     total: number;
  //   } = {
  //     items: [],
  //     total: passed.length,
  //   };
  //   const checklists =
  //     await this.technicalPreliminaryAssessmentDetailRepository.find({
  //       where: {
  //         technicalPreliminaryAssessment: {
  //           bidRegistrationDetail: {
  //             lotId,
  //             bidRegistration: {
  //               bidderId: In(passed.map((bidder) => bidder.bidderId)),
  //             },
  //           },
  //           evaluatorId,
  //         },
  //       },
  //       relations: {
  //         technicalPreliminaryAssessment: {
  //           bidRegistrationDetail: {
  //             bidRegistration: true,
  //           },
  //         },
  //       },
  //     });

  //   for (const bidder of passed) {
  //     if (checklists.length == 0) {
  //       response.items.push({ bidder, status: 'not started' });
  //     } else if (
  //       spdChecklist.length ===
  //       checklists.filter(
  //         (x) =>
  //           x.technicalPreliminaryAssessment.bidRegistrationDetail
  //             .bidRegistration.bidderId == bidder.bidderId &&
  //           x.technicalPreliminaryAssessment.isTeamAssessment ==
  //           isTeamAssessment,
  //       ).length
  //     ) {
  //       response.items.push({ bidder, status: 'completed' });
  //     } else if (
  //       checklists.filter(
  //         (x) =>
  //           x.technicalPreliminaryAssessment.bidRegistrationDetail
  //             .bidRegistration.bidderId == bidder.bidderId &&
  //           x.technicalPreliminaryAssessment.isTeamAssessment ==
  //           isTeamAssessment,
  //       ).length == 0
  //     ) {
  //       response.items.push({ bidder, status: 'not started' });
  //     } else {
  //       response.items.push({ bidder, status: 'in progress' });
  //     }
  //   }
  //   return response;
  // }
}
