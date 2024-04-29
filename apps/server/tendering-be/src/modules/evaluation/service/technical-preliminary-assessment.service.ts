import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository, createQueryBuilder } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { REQUEST } from '@nestjs/core';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TeamMember } from 'src/entities/team-member.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import {
  BidOpeningChecklist,
  SpdOpeningChecklist,
  SpdPreliminaryEvaluation,
  Tender,
} from 'src/entities';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';
import { DataResponseFormat } from 'src/shared/api-data';
import { NotFoundError } from 'rxjs';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { CreatePreliminaryAssessment } from '../dto/technical-preliminary-assessment.dto';

@Injectable()
export class TechnicalPreliminaryAssessmentService extends ExtraCrudService<TechnicalPreliminaryAssessment> {
  constructor(
    @InjectRepository(TechnicalPreliminaryAssessment)
    private readonly technicalPreliminaryAssessmentRepository: Repository<TechnicalPreliminaryAssessment>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(technicalPreliminaryAssessmentRepository);
  }

  async openingPassedBidders(
    lotId: string,
    isTeam: string,
    query: CollectionQuery,
    req: any,
  ) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the spd compliance for each bidder.
    //Todo check if the opener is in the team
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const evaluatorId = req.user.userId;
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;

    // const teamMember = this.isTeamMember(lotId, req.user.userId);
    // if (!teamMember) {
    //   throw new Error('You are not a team member');
    // }

    const [bidders, spdChecklistCount] = await Promise.all([
      manager
        .getRepository(BidOpeningChecklist)
        .createQueryBuilder('BidOpeningChecklist')
        .select('BidOpeningChecklist.bidderId', 'bidderId')
        .addSelect('COUNT(*)', 'count')
        .where('BidOpeningChecklist.isTeamLead = :isTeamLead', {
          isTeamLead: true,
        })
        .andWhere('BidOpeningChecklist.checked = :checked', { checked: true })
        .andWhere('BidOpeningChecklist.lotId = :lotId', { lotId })
        .groupBy('BidOpeningChecklist.bidderId')
        .orderBy('BidOpeningChecklist.bidderId')
        .getRawMany(),

      manager.getRepository(SpdOpeningChecklist).count({
        where: {
          spd: {
            tenderSpd: {
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
    const [passed, spdChecklist] = await Promise.all([
      manager.getRepository(BidRegistration).find({
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
      }),
      manager.getRepository(SpdPreliminaryEvaluation).find({
        where: {
          spd: {
            tenderSpd: {
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

    const response: {
      items: { bidder: BidRegistration; status: string }[];
      total: number;
    } = {
      items: [],
      total: passed.length,
    };
    const checklists = await this.technicalPreliminaryAssessmentRepository.find(
      {
        where: {
          bidRegistrationDetail: {
            lotId,
            bidRegistration: {
              bidderId: In(passed.map((bidder) => bidder.bidderId)),
            },
          },
          evaluatorId,
        },
        relations: {
          bidRegistrationDetail: {
            bidRegistration: true,
          },
        },
      },
    );

    for (const bidder of passed) {
      if (checklists.length == 0) {
        response.items.push({ bidder, status: 'not started' });
      } else if (
        spdChecklist.length ===
        checklists.filter(
          (x) =>
            x.bidRegistrationDetail.bidRegistration.bidderId ==
              bidder.bidderId && x.isTeamAssessment == isTeamAssessment,
        ).length
      ) {
        response.items.push({ bidder, status: 'completed' });
      } else if (
        checklists.filter(
          (x) =>
            x.bidRegistrationDetail.bidRegistration.bidderId ==
              bidder.bidderId && x.isTeamAssessment == isTeamAssessment,
        ).length == 0
      ) {
        response.items.push({ bidder, status: 'not started' });
      } else {
        response.items.push({ bidder, status: 'in progress' });
      }
    }
    return response;
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

  async openedTenders(query: CollectionQuery, req?: any) {
    query.where.push([
      {
        column: 'organizationId',
        value: req.user.organization.id,
        operator: FilterOperators.EqualTo,
      },
    ]);
    // query.includes.push('tenders.tenderMilestones')
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<Tender>(
      manager.getRepository(Tender),
      query,
    )
      .leftJoin('tenders.tenderMilestones', 'tenderMilestones')
      .andWhere('tenderMilestones.isCurrent = :isCurrent', { isCurrent: true })
      .andWhere('tenderMilestones.milestoneNum = :milestoneNum', {
        milestoneNum: 303,
      })
      .addSelect('tenderMilestones');
    const response = new DataResponseFormat<Tender>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }

  async checklistStatus(
    lotId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ) {
    const evaluatorId = req.user.userId;
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [spdChecklist, checklists] = await Promise.all([
      manager.getRepository(SpdPreliminaryEvaluation).find({
        where: {
          spd: {
            tenderSpd: {
              tender: {
                lots: {
                  id: lotId,
                },
              },
            },
          },
        },
      }),
      // Todo: check if the opener is the team member
      this.technicalPreliminaryAssessmentRepository.find({
        where: {
          bidRegistrationDetail: {
            lotId,
            bidRegistration: {
              bidderId,
            },
          },
          evaluatorId,
        },
      }),
    ]);
    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: checklists.find(
        (x) =>
          x.spdPreliminaryEvaluationId == spdChecklist.id &&
          x.isTeamAssessment == isTeamAssessment,
      )
        ? true
        : false,
    }));
    return response;
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationName = req.user.organization.name;
      itemData.organizationId = req.user.organization.id;
      itemData.evaluatorId = req.user.userId;
      itemData.evaluatorName = req.user.firstName + ' ' + req.user.lastName;
    }

    itemData.submit = false;

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          bidRegistration: {
            tenderId: itemData.tenderId,
            bidderId: itemData.bidderId,
          },

          lotId: itemData.lotId,
        },
      });

    if (!bidRegistrationDetail) {
      throw new Error('Bid Registration Detail not found');
    }

    itemData.bidRegistrationDetailId = bidRegistrationDetail.id;

    const item = this.technicalPreliminaryAssessmentRepository.create(itemData);
    await this.technicalPreliminaryAssessmentRepository.insert(item);
    return item;
  }

  async submit(itemData: any, req?: any): Promise<any> {
    const checklist = await this.technicalPreliminaryAssessmentRepository.find({
      where: {
        bidRegistrationDetail: {
          bidRegistration: {
            tenderId: itemData.tenderId,
          },
        },
        evaluatorId: req.user.userId,
      },
    });
    if (checklist.length == 0) {
      throw new NotFoundException('Preliminary evaluation not started yet');
    }

    await this.technicalPreliminaryAssessmentRepository.update(
      {
        bidRegistrationDetail: {
          bidRegistration: {
            tenderId: itemData.tenderId,
          },
        },
        evaluatorId: req.user.userId,
        isTeamAssessment: itemData.isTeamLead,
      },
      {
        submit: true,
      },
    );
  }
}
