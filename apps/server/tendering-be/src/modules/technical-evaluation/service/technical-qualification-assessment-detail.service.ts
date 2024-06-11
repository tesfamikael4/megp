import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TechnicalQualificationAssessmentDetail } from 'src/entities/technical-qualification-assessment-detail.entity';
import { CollectionQuery } from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { REQUEST } from '@nestjs/core';
import {
  BidRegistration,
  BidRegistrationDetail,
  EqcQualification,
  SpdQualification,
} from 'src/entities';
import { TeamMember } from 'src/entities/team-member.entity';
import { CompleteBidderEvaluationDto } from '../dto/technical-preliminary-assessment.dto';
import { TechnicalQualificationAssessment } from 'src/entities/technical-qualification-assessments.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { BidderStatusEnum } from 'src/shared/enums/bidder-status.enum';

@Injectable()
export class TechnicalQualificationAssessmentDetailService extends ExtraCrudService<TechnicalQualificationAssessmentDetail> {
  constructor(
    @InjectRepository(TechnicalQualificationAssessmentDetail)
    private readonly technicalQualificationAssessmentDetailRepository: Repository<TechnicalQualificationAssessmentDetail>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(technicalQualificationAssessmentDetailRepository);
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
          milestoneNum: 303,
          bidderStatus: 304,
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
      manager.getRepository(EqcQualification).findAndCount({
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
      await this.technicalQualificationAssessmentDetailRepository.find({
        where: {
          technicalQualificationAssessment: {
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
          technicalQualificationAssessment: {
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
            x.technicalQualificationAssessment.bidRegistrationDetail
              .bidRegistration.bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalQualificationAssessment.isTeamAssessment ==
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
            x.technicalQualificationAssessment.bidRegistrationDetail
              .bidRegistration.bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalQualificationAssessment.isTeamAssessment ==
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

    // return bidders
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
      manager.getRepository(EqcQualification).find({
        where: {
          lotId,
        },
      }),
      // Todo: check if the opener is the team member
      this.technicalQualificationAssessmentDetailRepository.find({
        where: {
          technicalQualificationAssessment: {
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
          technicalQualificationAssessment: true,
        },
      }),
    ]);
    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: checklists.find(
        (x) =>
          x.eqcQualificationId == spdChecklist.id &&
          x.technicalQualificationAssessment.isTeamAssessment ==
            isTeamAssessment,
      )
        ? true
        : false,
    }));

    return this.groupChecklist(response);
  }

  async groupChecklist(items: any[]) {
    const grouped: { [key: string]: any[] } = {};

    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return Object.keys(grouped).map((key, index) => ({
      id: `group-${index}`,
      title: key,
      checklist: grouped[key],
    }));
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
      qualificationDetailCount,
      qualificationCount,
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
      manager.getRepository(TechnicalQualificationAssessmentDetail).exists({
        where: {
          technicalQualificationAssessment: {
            bidRegistrationDetail: {
              lotId,
            },
            evaluatorId,
            submit: false,
            isTeamAssessment: false,
          },
        },
      }),
      manager.getRepository(TechnicalQualificationAssessmentDetail).exists({
        where: {
          technicalQualificationAssessment: {
            bidRegistrationDetail: {
              lotId,
            },
            submit: false,
            isTeamAssessment: false,
          },
        },
      }),
      manager.getRepository(TechnicalQualificationAssessmentDetail).find({
        where: {
          technicalQualificationAssessment: {
            bidRegistrationDetail: {
              lotId,
            },
          },
        },
      }),
      manager.getRepository(TechnicalQualificationAssessment).count({
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
      qualificationDetailCount.length == 0 ? false : !evaluationChecklist;
    response.canTeamAssess =
      qualificationDetailCount.length == 0 ? false : !canTeam;
    response.canTeamAssess = teamMemberCount == qualificationCount;

    if (isTeamLead) {
      const [teamCompleted, qualificationDetailCount] = await Promise.all([
        this.technicalQualificationAssessmentDetailRepository.find({
          where: {
            technicalQualificationAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              evaluatorId,
              isTeamAssessment: true,
              submit: false,
            },
          },
        }),
        this.technicalQualificationAssessmentDetailRepository.find({
          where: {
            technicalQualificationAssessment: {
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
          qualificationDetailCount.length == 0 ? false : true;
      }
    }

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

    const bidRegistrationDetailId = bidder.bidRegistrationDetails[0]?.id;
    const technicalQualificationAssessment = await manager
      .getRepository(TechnicalQualificationAssessment)
      .findOne({
        where: {
          bidRegistrationDetailId,
          isTeamAssessment: itemData.isTeamAssessment,
          evaluatorId: itemData.evaluatorId,
        },
      });

    if (!technicalQualificationAssessment) {
      const item = manager
        .getRepository(TechnicalQualificationAssessment)
        .create({
          bidRegistrationDetailId: bidder.bidRegistrationDetails[0]?.id,
          evaluatorId: req.user.userId,
          evaluatorName: req.user.firstName + ' ' + req.user.lastName,
          isTeamAssessment: itemData.isTeamAssessment,
          submit: false,
          // technicalQualificationAssessmentDetail: [itemD]
        });

      const savedItem = await manager
        .getRepository(TechnicalQualificationAssessment)
        .save(item);

      const itemD = manager
        .getRepository(TechnicalQualificationAssessmentDetail)
        .create({
          ...itemData,
          technicalQualificationAssessmentId: savedItem.id,
        }) as any;
      await manager
        .getRepository(TechnicalQualificationAssessmentDetail)
        .save(itemD);
    } else {
      const itemD = manager
        .getRepository(TechnicalQualificationAssessmentDetail)
        .create({
          ...itemData,
          technicalQualificationAssessmentId:
            technicalQualificationAssessment.id,
        }) as any;
      await manager
        .getRepository(TechnicalQualificationAssessmentDetail)
        .save(itemD);
    }

    itemData.bidRegistrationDetailId = bidder.bidRegistrationDetails[0]?.id;

    const item =
      this.technicalQualificationAssessmentDetailRepository.create(itemData);
    // await this.technicalQualificationAssessmentDetailRepository.insert(item);
    return item;
  }

  async completeBidderEvaluation(
    itemData: CompleteBidderEvaluationDto,
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const assessment = await manager
      .getRepository(TechnicalQualificationAssessment)
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
          technicalQualificationAssessmentDetail: true,
        },
      });
    await manager.getRepository(TechnicalQualificationAssessment).update(
      {
        id: assessment.id,
      },
      {
        qualified: EvaluationStatusEnum.COMPLY,
      },
    );
  }

  async submit(itemData: any, req?: any): Promise<any> {
    const checklist =
      await this.technicalQualificationAssessmentDetailRepository.find({
        where: {
          technicalQualificationAssessment: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
            evaluatorId: req.user.userId,
          },
        },
        relations: {
          technicalQualificationAssessment: true,
        },
      });
    if (checklist.length == 0) {
      throw new NotFoundException('Qualification evaluation not started yet');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await manager.getRepository(TechnicalQualificationAssessment).update(
      {
        id: In(
          checklist.map((list) => list.technicalQualificationAssessmentId),
        ),
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
        milestoneNum: TenderMilestoneEnum.TechnicalResponsiveness,
        milestoneTxt: 'TechnicalResponsiveness',
        isCurrent: true,
      });

      const technicalQualificationAssessment = await manager
        .getRepository(TechnicalQualificationAssessment)
        .find({
          where: {
            // bidderId: itemData.bidderId,
            isTeamAssessment: true,
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
          },
        });

      const biddersComparison = technicalQualificationAssessment.map((list) => {
        return {
          bidRegistrationDetailId: list.bidRegistrationDetailId,
          milestoneNum: TenderMilestoneEnum.TechnicalQualification,
          milestoneTxt: 'TechnicalQualification',
          bidderStatus:
            list.qualified == EvaluationStatusEnum.COMPLY
              ? BidderStatusEnum.TechnicalQualificationSucceeded
              : BidderStatusEnum.TechnicalQualificationFailed,
          bidderStatusTxt:
            list.qualified == EvaluationStatusEnum.COMPLY
              ? 'TechnicalQualificationSucceeded'
              : 'TechnicalQualificationFailed',
          passFail:
            list.qualified == EvaluationStatusEnum.COMPLY ? true : false,
        };
      });
      await manager.getRepository(BiddersComparison).insert(biddersComparison);
    }
  }

  async evaluatorReport(
    lotId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ): Promise<any> {
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [technicalQualificationAssessmentDetail, eqcQualification] =
      await Promise.all([
        manager.getRepository(TechnicalQualificationAssessmentDetail).find({
          where: {
            technicalQualificationAssessment: {
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
            eqcQualification: true,
          },
          select: {
            id: true,
            qualified: true,
            eqcQualificationId: true,
            remark: true,
            technicalQualificationAssessment: {
              isTeamAssessment: true,
            },
          },
        }),

        manager.getRepository(EqcQualification).find({
          where: {
            lotId,
          },
        }),
      ]);

    const response = eqcQualification.map((eqcQualification) => ({
      ...eqcQualification,
      check: technicalQualificationAssessmentDetail.find(
        (x) => x.eqcQualificationId == eqcQualification.id,
      ),
    }));
    return response;
  }

  async membersReport(
    eqcQualificationId: string,
    bidderId: string,
    lotId: string,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const report = await manager
      .getRepository(TechnicalQualificationAssessmentDetail)
      .find({
        where: {
          eqcQualificationId,
          technicalQualificationAssessment: {
            bidRegistrationDetail: {
              bidRegistration: {
                bidderId,
              },
              lotId,
            },
          },
        },
        relations: {
          technicalQualificationAssessment: true,
        },
      });
    return report;
  }
}
