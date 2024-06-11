import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { REQUEST } from '@nestjs/core';
import { TechnicalPreliminaryAssessmentDetail } from 'src/entities/technical-preliminary-assessment-detail.entity';
import { TeamMember } from 'src/entities/team-member.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import {
  BidOpeningChecklistAssessmentDetail,
  EqcPreliminaryExamination,
  SpdOpeningChecklist,
  SpdPreliminaryEvaluation,
  Tender,
} from 'src/entities';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';
import { DataResponseFormat } from 'src/shared/api-data';
import { BidRegistrationDetail } from 'src/entities/bid-registration-detail.entity';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { CompleteBidderEvaluationDto } from '../dto/technical-preliminary-assessment.dto';
import { BidderStatusEnum } from 'src/shared/enums/bidder-status.enum';

@Injectable()
export class TechnicalPreliminaryAssessmentDetailService extends ExtraCrudService<TechnicalPreliminaryAssessmentDetail> {
  constructor(
    @InjectRepository(TechnicalPreliminaryAssessmentDetail)
    private readonly technicalPreliminaryAssessmentDetailRepository: Repository<TechnicalPreliminaryAssessmentDetail>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(technicalPreliminaryAssessmentDetailRepository);
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

    // const evaluatorId = req.user.userId;

    const [passed, spdChecklist] = await Promise.all([
      await manager.getRepository(BiddersComparison).find({
        where: {
          bidRegistrationDetail: {
            lotId: lotId,
          },
          milestoneNum: 301,
          bidderStatus: 302,
          isCurrent: true,
        },
        relations: {
          bidRegistrationDetail: {
            bidRegistration: true,
          },
        },
        select: {
          id: true,
          bidRegistrationDetail: {
            id: true,
            bidRegistration: {
              id: true,
              bidderId: true,
              bidderName: true,
            },
          },
        },
      }),
      manager.getRepository(EqcPreliminaryExamination).findAndCount({
        where: {
          lotId,
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

    const checklists =
      await this.technicalPreliminaryAssessmentDetailRepository.find({
        where: {
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              lotId,
              bidRegistration: {
                bidderId: In(
                  passed.map(
                    (bidder) =>
                      bidder.bidRegistrationDetail.bidRegistration.bidderId,
                  ),
                ),
              },
            },
            evaluatorId,
          },
        },
        relations: {
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              bidRegistration: true,
            },
          },
        },
      });

    for (const bidder of passed) {
      if (checklists.length == 0) {
        response.items.push({
          bidder: bidder.bidRegistrationDetail.bidRegistration,
          status: 'not started',
        });
      } else if (
        spdChecklist[1] ===
        checklists.filter(
          (x) =>
            x.technicalPreliminaryAssessment.bidRegistrationDetail
              .bidRegistration.bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalPreliminaryAssessment.isTeamAssessment ==
              isTeamAssessment,
        ).length
      ) {
        response.items.push({
          bidder: bidder.bidRegistrationDetail.bidRegistration,
          status: 'completed',
        });
      } else if (
        checklists.filter(
          (x) =>
            x.technicalPreliminaryAssessment.bidRegistrationDetail
              .bidRegistration.bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalPreliminaryAssessment.isTeamAssessment ==
              isTeamAssessment,
        ).length == 0
      ) {
        response.items.push({
          bidder: bidder.bidRegistrationDetail.bidRegistration,
          status: 'not started',
        });
      } else {
        response.items.push({
          bidder: bidder.bidRegistrationDetail.bidRegistration,
          status: 'in progress',
        });
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
      .leftJoinAndSelect('tenders.tenderMilestones', 'tenderMilestones')
      .andWhere('tenderMilestones.isCurrent = :isCurrent', { isCurrent: true })
      .andWhere('tenderMilestones.milestoneNum >= :milestoneNum', {
        milestoneNum: 303,
      });
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
      manager.getRepository(EqcPreliminaryExamination).find({
        where: {
          lotId,
        },
      }),
      // Todo: check if the opener is the team member
      this.technicalPreliminaryAssessmentDetailRepository.find({
        where: {
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              lotId,
              bidRegistration: {
                bidderId,
              },
            },
            evaluatorId,
          },
        },
        relations: {
          technicalPreliminaryAssessment: true,
        },
      }),
    ]);
    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: checklists.find(
        (x) =>
          x.eqcPreliminaryExaminationId == spdChecklist.id &&
          x.technicalPreliminaryAssessment.isTeamAssessment == isTeamAssessment,
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

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const bidder = await manager.getRepository(BidRegistration).findOne({
      where: {
        bidderId: itemData.bidderId,
        bidRegistrationDetails: {
          lotId: itemData.lotId,
        },
      },
      relations: {
        bidRegistrationDetails: true,
      },
      select: {
        id: true,
        bidderName: true,
        bidRegistrationDetails: {
          id: true,
        },
      },
    });
    if (!bidder) {
      throw new NotFoundException('Bidder not found');
    }

    itemData.submit = false;

    // const bidRegistrationDetail = await manager
    //   .getRepository(BidRegistrationDetail)
    //   .findOne({
    //     where: {
    //       bidRegistration: {
    //         tenderId: itemData.tenderId,
    //         bidderId: itemData.bidderId,
    //       },

    //       lotId: itemData.lotId,
    //     },
    //   });

    // if (!bidRegistrationDetail) {
    //   throw new Error('Bid Registration Detail not found');
    // }

    const bidRegistrationDetailId = bidder.bidRegistrationDetails[0]?.id;
    const technicalPreliminaryAssessment = await manager
      .getRepository(TechnicalPreliminaryAssessment)
      .findOne({
        where: {
          bidRegistrationDetailId,
          isTeamAssessment: itemData.isTeamAssessment,
          evaluatorId: itemData.evaluatorId,
        },
      });

    if (!technicalPreliminaryAssessment) {
      const item = manager
        .getRepository(TechnicalPreliminaryAssessment)
        .create({
          bidRegistrationDetailId: bidder.bidRegistrationDetails[0]?.id,
          evaluatorId: req.user.userId,
          evaluatorName: req.user.firstName + ' ' + req.user.lastName,
          isTeamAssessment: itemData.isTeamAssessment,
          submit: false,
          // technicalPreliminaryAssessmentDetail: [itemD]
        });

      const savedItem = await manager
        .getRepository(TechnicalPreliminaryAssessment)
        .save(item);

      const itemD = manager
        .getRepository(TechnicalPreliminaryAssessmentDetail)
        .create({
          ...itemData,
          technicalPreliminaryAssessmentId: savedItem.id,
        }) as any;
      await manager
        .getRepository(TechnicalPreliminaryAssessmentDetail)
        .save(itemD);
    } else {
      const itemD = manager
        .getRepository(TechnicalPreliminaryAssessmentDetail)
        .create({
          ...itemData,
          technicalPreliminaryAssessmentId: technicalPreliminaryAssessment.id,
        }) as any;
      await manager
        .getRepository(TechnicalPreliminaryAssessmentDetail)
        .save(itemD);
    }

    itemData.bidRegistrationDetailId = bidder.bidRegistrationDetails[0]?.id;

    const item =
      this.technicalPreliminaryAssessmentDetailRepository.create(itemData);
    // await this.technicalPreliminaryAssessmentDetailRepository.insert(item);
    return item;
  }

  async submit(itemData: any, req?: any): Promise<any> {
    const checklist =
      await this.technicalPreliminaryAssessmentDetailRepository.find({
        where: {
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
            evaluatorId: req.user.userId,
          },
        },
        relations: {
          technicalPreliminaryAssessment: true,
        },
      });
    if (checklist.length == 0) {
      throw new NotFoundException('Preliminary evaluation not started yet');
    }

    // await this.technicalPreliminaryAssessmentRepository.update(
    //   {
    //     id: In(checklist.map((list) => list.id)),
    //     technicalPreliminaryAssessment: {
    //       isTeamAssessment: itemData.isTeamLead,
    //     },
    //   },
    //   {
    //     technicalPreliminaryAssessment: {
    //       submit: true,
    //     },
    //   },
    // );
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await manager.getRepository(TechnicalPreliminaryAssessment).update(
      {
        id: In(checklist.map((list) => list.technicalPreliminaryAssessmentId)),
        isTeamAssessment: itemData.isTeamLead,
      },
      {
        submit: true,
      },
    );

    if (itemData.isTeamLead) {
      await manager.getRepository(TenderMilestone).update(
        {
          lotId: itemData.lotId,
          tenderId: itemData.tenderId,
        },
        {
          isCurrent: false,
        },
      );
      await manager.getRepository(TenderMilestone).insert({
        lotId: itemData.lotId,
        tenderId: itemData.tenderId,
        milestoneNum: 304,
        milestoneTxt: 'TechnicalQualification',
        isCurrent: true,
      });

      const technicalPreliminaryAssessment = await manager
        .getRepository(TechnicalPreliminaryAssessment)
        .find({
          where: {
            // bidderId: itemData.bidderId,
            isTeamAssessment: true,
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
          },
        });

      const biddersComparison = technicalPreliminaryAssessment.map((list) => {
        return {
          bidRegistrationDetailId: list.bidRegistrationDetailId,
          milestoneNum: 303,
          milestoneTxt: 'TechnicalCompliance',
          bidderStatus:
            list.qualified == 'COMPLY'
              ? BidderStatusEnum.TechnicalComplianceSucceeded
              : BidderStatusEnum.TechnicalComplianceFailed,
          bidderStatusTxt:
            list.qualified == 'COMPLY'
              ? 'TechnicalComplianceSucceeded'
              : 'TechnicalComplianceFailed',
          passFail: list.qualified == 'COMPLY' ? true : false,
        };
      });
      await manager.getRepository(BiddersComparison).insert(biddersComparison);
    }
  }

  async canComplete(
    lotId: string,
    req: any,
  ): Promise<{
    isTeamLead: {
      isTeam: boolean;
      hasCompleted: boolean;
    };
    hasCompleted: boolean;
    canTeamAssess: boolean;
  }> {
    const response: {
      isTeamLead: { isTeam: boolean; hasCompleted: boolean };
      hasCompleted: boolean;
      canTeamAssess: boolean;
    } = {
      isTeamLead: { isTeam: false, hasCompleted: false },
      hasCompleted: false,
      canTeamAssess: false,
    };
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const evaluatorId = req.user.userId;
    const [
      isTeamLead,
      evaluationChecklist,
      canTeam,
      complianceDetailCount,
      complianceCount,
      teamMemberCount,
    ] = await Promise.all([
      manager.getRepository(TeamMember).exists({
        where: {
          team: {
            tender: {
              lots: {
                id: lotId,
              },
            },
          },
          personnelId: evaluatorId,
          isTeamLead: true,
        },
      }),
      manager.getRepository(TechnicalPreliminaryAssessmentDetail).exists({
        where: {
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              lotId,
            },
            evaluatorId,
            submit: false,
            isTeamAssessment: false,
          },
        },
      }),
      manager.getRepository(TechnicalPreliminaryAssessmentDetail).exists({
        where: {
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              lotId,
            },
            submit: false,
            isTeamAssessment: false,
          },
        },
      }),
      manager.getRepository(TechnicalPreliminaryAssessmentDetail).find({
        where: {
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              lotId,
            },
          },
        },
      }),
      manager.getRepository(TechnicalPreliminaryAssessment).count({
        where: {
          bidRegistrationDetail: {
            lotId,
          },
          submit: true,
        },
      }),
      manager.getRepository(TeamMember).count({
        where: {
          team: {
            tender: {
              lots: {
                id: lotId,
              },
            },
          },
          personnelId: evaluatorId,
        },
      }),
    ]);
    response.isTeamLead.isTeam = isTeamLead;
    response.hasCompleted =
      complianceDetailCount.length == 0 ? false : !evaluationChecklist;
    response.canTeamAssess =
      complianceDetailCount.length == 0 ? false : !canTeam;
    response.canTeamAssess = teamMemberCount == complianceCount;

    if (isTeamLead) {
      const [teamCompleted, complianceDetailCount] = await Promise.all([
        this.technicalPreliminaryAssessmentDetailRepository.find({
          where: {
            technicalPreliminaryAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              evaluatorId,
              isTeamAssessment: true,
              submit: false,
            },
          },
        }),
        this.technicalPreliminaryAssessmentDetailRepository.find({
          where: {
            technicalPreliminaryAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              evaluatorId,
              isTeamAssessment: true,
            },
          },
        }),
      ]);
      if (teamCompleted.length == 0) {
        response.isTeamLead.hasCompleted =
          complianceDetailCount.length == 0 ? false : true;
      }
    }

    return response;
  }

  async membersReport(
    eqcPreliminaryExaminationId: string,
    bidderId: string,
    lotId: string,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const report = await manager
      .getRepository(TechnicalPreliminaryAssessmentDetail)
      .find({
        where: {
          eqcPreliminaryExaminationId,
          technicalPreliminaryAssessment: {
            bidRegistrationDetail: {
              bidRegistration: {
                bidderId,
              },
              lotId,
            },
          },
        },
        relations: {
          technicalPreliminaryAssessment: true,
        },
      });
    return report;
  }

  // complete evaluators assessment report for individual bidders
  async completeBidderEvaluation(
    itemData: CompleteBidderEvaluationDto,
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const assessment = await manager
      .getRepository(TechnicalPreliminaryAssessment)
      .findOne({
        where: {
          bidRegistrationDetail: {
            bidRegistration: {
              bidderId: itemData.bidderId,
            },
            lotId: itemData.lotId,
          },
          evaluatorId: req.user.userId,
          isTeamAssessment: itemData.isTeamLead,
        },
        relations: {
          technicalPreliminaryAssessmentDetail: true,
        },
      });
    await manager.getRepository(TechnicalPreliminaryAssessment).update(
      {
        id: assessment.id,
      },
      {
        qualified: EvaluationStatusEnum.COMPLY,
      },
    );
  }

  async evaluatorReport(
    lotId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ): Promise<any> {
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [technicalPreliminaryAssessmentDetail, spdChecklist] =
      await Promise.all([
        manager.getRepository(TechnicalPreliminaryAssessmentDetail).find({
          where: {
            technicalPreliminaryAssessment: {
              bidRegistrationDetail: {
                lotId: lotId,
                bidRegistration: {
                  bidderId: bidderId,
                },
              },
              evaluatorId: req.user.userId,
              isTeamAssessment: isTeamAssessment,
            },
          },
          relations: {
            eqcPreliminaryExamination: true,
          },
          select: {
            id: true,
            qualified: true,
            eqcPreliminaryExaminationId: true,
            remark: true,
            technicalPreliminaryAssessment: {
              isTeamAssessment: true,
            },
          },
        }),

        manager.getRepository(EqcPreliminaryExamination).find({
          where: {
            lotId,
          },
        }),
      ]);

    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: technicalPreliminaryAssessmentDetail.find(
        (x) => x.eqcPreliminaryExaminationId == spdChecklist.id,
      ),
    }));
    return response;
  }
}
