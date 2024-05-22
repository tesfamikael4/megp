import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ArrayContains,
  EntityManager,
  In,
  JsonContains,
  Repository,
} from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TechnicalScoringAssessmentDetail } from 'src/entities/technical-scoring-assessment-detail.entity';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';
import { REQUEST } from '@nestjs/core';
import {
  BidRegistration,
  BidRegistrationDetail,
  EqcTechnicalScoring,
  Item,
  SorTechnicalRequirement,
} from 'src/entities';
import { TeamMember } from 'src/entities/team-member.entity';
import { CompleteBidderEvaluationDto } from '../dto/technical-preliminary-assessment.dto';
import { TechnicalScoringAssessment } from 'src/entities/technical-scoring-assessments.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { BidderStatusEnum } from 'src/shared/enums/bidder-status.enum';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class TechnicalScoringAssessmentDetailService extends ExtraCrudService<TechnicalScoringAssessmentDetail> {
  constructor(
    @InjectRepository(TechnicalScoringAssessmentDetail)
    private readonly technicalScoringAssessmentDetailRepository: Repository<TechnicalScoringAssessmentDetail>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(technicalScoringAssessmentDetailRepository);
  }
  async getItemsByLotId(lotId: string, query: CollectionQuery, req: any) {
    query.where.push([
      {
        column: 'lotId',
        value: lotId,
        operator: FilterOperators.EqualTo,
      },
    ]);
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<Item>(
      manager.getRepository(Item),
      query,
    );
    const response = new DataResponseFormat<Item>();
    if (query.count) {
      response.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      response.total = total;
      response.items = result;
    }
    return response;
  }
  async passedBidders(
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

    const [passed, eqcChecklist] = await Promise.all([
      manager.getRepository(BiddersComparison).find({
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
      manager.getRepository(EqcTechnicalScoring).findAndCount({
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
      await this.technicalScoringAssessmentDetailRepository.find({
        where: {
          technicalScoringAssessment: {
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
          technicalScoringAssessment: {
            bidRegistrationDetail: {
              bidRegistration: true,
            },
          },
        },
      });

    for (const bidder of passed) {
      const test = checklists.filter(
        (x) =>
          x.technicalScoringAssessment.bidRegistrationDetail.bidRegistration
            .bidderId ==
            bidder.bidRegistrationDetail.bidRegistration.bidderId &&
          x.technicalScoringAssessment.isTeamAssessment == isTeamAssessment,
      );
      if (checklists.length == 0) {
        response.items.push({
          bidder: bidder.bidRegistrationDetail.bidRegistration,
          status: 'not started',
        });
      } else if (
        eqcChecklist[1] ===
        checklists.filter(
          (x) =>
            x.technicalScoringAssessment.bidRegistrationDetail.bidRegistration
              .bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalScoringAssessment.isTeamAssessment == isTeamAssessment,
        ).length
      ) {
        response.items.push({
          bidder: bidder.bidRegistrationDetail.bidRegistration,
          status: 'completed',
        });
      } else if (
        checklists.filter(
          (x) =>
            x.technicalScoringAssessment.bidRegistrationDetail.bidRegistration
              .bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalScoringAssessment.isTeamAssessment == isTeamAssessment,
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
    itemId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ) {
    const evaluatorId = req.user.userId;
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [spdChecklist, checklists] = await Promise.all([
      manager.getRepository(SorTechnicalRequirement).find({
        where: {
          itemId,
        },
      }),
      // Todo: check if the opener is the team member
      this.technicalScoringAssessmentDetailRepository.find({
        where: {
          technicalScoringAssessment: {
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
          technicalScoringAssessment: true,
        },
      }),
    ]);
    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: checklists.find(
        (x) =>
          x.eqcTechnicalScoringId == spdChecklist.id &&
          x.technicalScoringAssessment.isTeamAssessment == isTeamAssessment,
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
    const [isTeamLead, evaluationChecklist, canTeam, scoringCount] =
      await Promise.all([
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
        manager.getRepository(TechnicalScoringAssessmentDetail).exists({
          where: {
            technicalScoringAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              evaluatorId,
              submit: false,
              isTeamAssessment: false,
            },
          },
        }),
        manager.getRepository(TechnicalScoringAssessmentDetail).exists({
          where: {
            technicalScoringAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              submit: false,
              isTeamAssessment: false,
            },
          },
        }),
        manager.getRepository(TechnicalScoringAssessmentDetail).find({
          where: {
            technicalScoringAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
            },
          },
        }),
      ]);
    response.isTeamLead.isTeam = isTeamLead;
    response.hasCompleted =
      scoringCount.length == 0 ? false : !evaluationChecklist;
    response.canTeamAssess = scoringCount.length == 0 ? false : !canTeam;

    if (isTeamLead) {
      const [teamCompleted, scoringCount] = await Promise.all([
        this.technicalScoringAssessmentDetailRepository.find({
          where: {
            technicalScoringAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              evaluatorId,
              isTeamAssessment: true,
              submit: false,
            },
          },
        }),
        this.technicalScoringAssessmentDetailRepository.find({
          where: {
            technicalScoringAssessment: {
              bidRegistrationDetail: {
                lotId,
                //
              },
              evaluatorId,
              isTeamAssessment: true,
            },
          },
        }),
      ]);
      if (teamCompleted.length == 0) {
        response.isTeamLead.hasCompleted =
          scoringCount.length == 0 ? false : true;
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
    const technicalScoringAssessment = await manager
      .getRepository(TechnicalScoringAssessment)
      .findOne({
        where: {
          bidRegistrationDetailId,
          isTeamAssessment: itemData.isTeamAssessment,
        },
      });

    if (!technicalScoringAssessment) {
      const item = manager.getRepository(TechnicalScoringAssessment).create({
        bidRegistrationDetailId: bidder.bidRegistrationDetails[0]?.id,
        evaluatorId: req.user.userId,
        evaluatorName: req.user.firstName + ' ' + req.user.lastName,
        isTeamAssessment: itemData.isTeamAssessment,
        submit: false,
        // technicalScoringAssessmentDetail: [itemD]
      });

      const savedItem = await manager
        .getRepository(TechnicalScoringAssessment)
        .save(item);

      const itemD = manager
        .getRepository(TechnicalScoringAssessmentDetail)
        .create({
          ...itemData,
          technicalScoringAssessmentId: savedItem.id,
        }) as any;
      await manager.getRepository(TechnicalScoringAssessmentDetail).save(itemD);
    } else {
      const itemD = manager
        .getRepository(TechnicalScoringAssessmentDetail)
        .create({
          ...itemData,
          technicalScoringAssessmentId: technicalScoringAssessment.id,
        }) as any;
      await manager.getRepository(TechnicalScoringAssessmentDetail).save(itemD);
    }

    itemData.bidRegistrationDetailId = bidder.bidRegistrationDetails[0]?.id;

    const item =
      this.technicalScoringAssessmentDetailRepository.create(itemData);
    // await this.technicalScoringAssessmentDetailRepository.insert(item);
    return item;
  }

  // async completeBidderEvaluation(
  //   itemData: CompleteBidderEvaluationDto,
  //   req: any,
  // ) {
  //   const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
  //   const assessment = await manager
  //     .getRepository(TechnicalScoringAssessment)
  //     .findOne({
  //       where: {
  //         bidRegistrationDetail: {
  //           bidRegistration: {
  //             bidderId: itemData.bidderId,
  //           },
  //           lotId: itemData.lotId,
  //         },
  //         // technicalScoringAssessmentDetail: {

  //         // },
  //         evaluatorId: req.user.userId,
  //         isTeamAssessment: itemData.isTeamLead,
  //       },
  //       relations: {
  //         technicalScoringAssessmentDetail: true,
  //       },
  //     });
  //   await manager.getRepository(TechnicalScoringAssessment).update(
  //     {
  //       id: assessment.id,
  //     },
  //     {
  //       qualified: EvaluationStatusEnum.COMPLY,
  //     },
  //   );
  // }

  // async submit(itemData: any, req?: any): Promise<any> {
  //   const checklist =
  //     await this.technicalScoringAssessmentDetailRepository.find({
  //       where: {
  //         technicalScoringAssessment: {
  //           bidRegistrationDetail: {
  //             lotId: itemData.lotId,
  //             // technicalItems: ArrayContains([itemData.itemId]),
  //           },
  //           evaluatorId: req.user.userId,
  //         },
  //       },
  //       relations: {
  //         technicalScoringAssessment: true,
  //       },
  //     });
  //   if (checklist.length == 0) {
  //     throw new NotFoundException('Scoring evaluation not started yet');
  //   }

  //   const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

  //   await manager.getRepository(TechnicalScoringAssessment).update(
  //     {
  //       id: In(checklist.map((list) => list.technicalScoringAssessmentId)),
  //       isTeamAssessment: itemData.isTeamLead,
  //     },
  //     {
  //       submit: true,
  //     },
  //   );

  //   if (itemData.isTeamLead) {
  //     await manager.getRepository(TenderMilestone).update(
  //       {
  //         lotId: itemData.lotId,
  //         tenderId: itemData.tenderId,
  //       },
  //       {
  //         isCurrent: false,
  //       },
  //     );
  //     await manager.getRepository(TenderMilestone).insert({
  //       lotId: itemData.lotId,
  //       tenderId: itemData.tenderId,
  //       milestoneNum: TenderMilestoneEnum.TechnicalScoring,
  //       milestoneTxt: 'TechnicalScoring',
  //       isCurrent: true,
  //     });

  //     const technicalScoringAssessment = await manager
  //       .getRepository(TechnicalScoringAssessment)
  //       .find({
  //         where: {
  //           // bidderId: itemData.bidderId,
  //           isTeamAssessment: true,
  //           bidRegistrationDetail: {
  //             lotId: itemData.lotId,
  //             technicalItems: ArrayContains([itemData.itemId]),
  //           },
  //         },
  //       });

  //     const biddersComparison = technicalScoringAssessment.map((list) => {
  //       return {
  //         bidRegistrationDetailId: list.bidRegistrationDetailId,
  //         milestoneNum: TenderMilestoneEnum.TechnicalScoring,
  //         milestoneTxt: 'TechnicalScoring',
  //         bidderStatus:
  //           list.qualified == EvaluationStatusEnum.COMPLY ? 306 : 305,
  //         bidderStatusTxt:
  //           list.qualified == EvaluationStatusEnum.COMPLY
  //             ? 'TechnicalScoringSucceeded'
  //             : 'TechnicalScoringFailed',
  //         passFail:
  //           list.qualified == EvaluationStatusEnum.COMPLY ? true : false,
  //       };
  //     });
  //     await manager.getRepository(BiddersComparison).insert(biddersComparison);
  //   }
  // }

  async evaluatorReport(
    lotId: string,
    itemId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ): Promise<any> {
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [technicalScoringAssessmentDetail, spdChecklist] = await Promise.all([
      manager.getRepository(TechnicalScoringAssessmentDetail).find({
        where: {
          technicalScoringAssessment: {
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
          eqcTechnicalScoring: true,
        },
        select: {
          id: true,
          // qualified: true,
          eqcTechnicalScoringId: true,
          remark: true,
          technicalScoringAssessment: {
            isTeamAssessment: true,
          },
        },
      }),
      manager.getRepository(SorTechnicalRequirement).find({
        where: {
          itemId,
        },
      }),
    ]);
    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: technicalScoringAssessmentDetail.find(
        (x) => x.eqcTechnicalScoringId == spdChecklist.id,
      ),
    }));
    return response;
  }

  async membersReport(
    eqcTechnicalScoringId: string,
    bidderId: string,
    lotId: string,
    itemId: string,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const report = await manager
      .getRepository(TechnicalScoringAssessmentDetail)
      .find({
        where: {
          eqcTechnicalScoringId,
          technicalScoringAssessment: {
            bidRegistrationDetail: {
              bidRegistration: {
                bidderId,
              },
              lotId,
            },
          },
        },
        relations: {
          technicalScoringAssessment: true,
        },
      });
    return report;
  }
}
