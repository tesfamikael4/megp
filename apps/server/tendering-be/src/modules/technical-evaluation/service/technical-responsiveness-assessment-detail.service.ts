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
import { TechnicalResponsivenessAssessmentDetail } from 'src/entities/technical-responsiveness-assessment-detail.entity';
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
  Item,
  SorTechnicalRequirement,
} from 'src/entities';
import { TeamMember } from 'src/entities/team-member.entity';
import {
  CompleteBidderEvaluationDto,
  CompleteResponsivenessBidderEvaluationDto,
} from '../dto/technical-preliminary-assessment.dto';
import { TechnicalResponsivenessAssessment } from 'src/entities/technical-responsiveness-assessments.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { BidderStatusEnum } from 'src/shared/enums/bidder-status.enum';
import { DataResponseFormat } from 'src/shared/api-data';

@Injectable()
export class TechnicalResponsivenessAssessmentDetailService extends ExtraCrudService<TechnicalResponsivenessAssessmentDetail> {
  constructor(
    @InjectRepository(TechnicalResponsivenessAssessmentDetail)
    private readonly technicalResponsivenessAssessmentDetailRepository: Repository<TechnicalResponsivenessAssessmentDetail>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(technicalResponsivenessAssessmentDetailRepository);
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
    itemId: string,
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

    const [passed, spdChecklist] = await Promise.all([
      manager.getRepository(BiddersComparison).find({
        where: {
          bidRegistrationDetail: {
            lotId: lotId,
            technicalItems: ArrayContains([itemId]),
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
      manager.getRepository(SorTechnicalRequirement).findAndCount({
        where: {
          itemId,
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
      await this.technicalResponsivenessAssessmentDetailRepository.find({
        where: {
          technicalResponsivenessAssessment: {
            itemId,
            bidRegistrationDetail: {
              lotId,
              technicalItems: ArrayContains([itemId]),
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
          technicalResponsivenessAssessment: {
            bidRegistrationDetail: {
              bidRegistration: true,
            },
          },
        },
      });

    for (const bidder of passed) {
      const test = checklists.filter(
        (x) =>
          x.technicalResponsivenessAssessment.bidRegistrationDetail
            .bidRegistration.bidderId ==
            bidder.bidRegistrationDetail.bidRegistration.bidderId &&
          x.technicalResponsivenessAssessment.isTeamAssessment ==
            isTeamAssessment,
      );
      if (checklists.length == 0) {
        response.items.push({
          bidder: bidder.bidRegistrationDetail.bidRegistration,
          status: 'not started',
        });
      } else if (
        spdChecklist[1] ===
        checklists.filter(
          (x) =>
            x.technicalResponsivenessAssessment.bidRegistrationDetail
              .bidRegistration.bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalResponsivenessAssessment.isTeamAssessment ==
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
            x.technicalResponsivenessAssessment.bidRegistrationDetail
              .bidRegistration.bidderId ==
              bidder.bidRegistrationDetail.bidRegistration.bidderId &&
            x.technicalResponsivenessAssessment.isTeamAssessment ==
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
      this.technicalResponsivenessAssessmentDetailRepository.find({
        where: {
          technicalResponsivenessAssessment: {
            bidRegistrationDetail: {
              lotId,
              technicalItems: ArrayContains([itemId]),
              bidRegistration: {
                bidderId,
              },
            },
            evaluatorId,
          },
        },
        relations: {
          technicalResponsivenessAssessment: true,
        },
      }),
    ]);
    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: checklists.find(
        (x) =>
          x.sorTechnicalRequirementId == spdChecklist.id &&
          x.technicalResponsivenessAssessment.isTeamAssessment ==
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
    const [isTeamLead, evaluationChecklist, canTeam, responsivenessCount] =
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
        manager.getRepository(TechnicalResponsivenessAssessmentDetail).exists({
          where: {
            technicalResponsivenessAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              evaluatorId,
              submit: false,
              isTeamAssessment: false,
            },
          },
        }),
        manager.getRepository(TechnicalResponsivenessAssessmentDetail).exists({
          where: {
            technicalResponsivenessAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              submit: false,
              isTeamAssessment: false,
            },
          },
        }),
        manager.getRepository(TechnicalResponsivenessAssessmentDetail).find({
          where: {
            technicalResponsivenessAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
            },
          },
        }),
      ]);
    response.isTeamLead.isTeam = isTeamLead;
    response.hasCompleted =
      responsivenessCount.length == 0 ? false : !evaluationChecklist;
    response.canTeamAssess = responsivenessCount.length == 0 ? false : !canTeam;

    if (isTeamLead) {
      const [teamCompleted, responsivenessCount] = await Promise.all([
        this.technicalResponsivenessAssessmentDetailRepository.find({
          where: {
            technicalResponsivenessAssessment: {
              bidRegistrationDetail: {
                lotId,
              },
              evaluatorId,
              isTeamAssessment: true,
              submit: false,
            },
          },
        }),
        this.technicalResponsivenessAssessmentDetailRepository.find({
          where: {
            technicalResponsivenessAssessment: {
              bidRegistrationDetail: {
                lotId,
                // technicalItems: ArrayContains([itemId]),
              },
              evaluatorId,
              isTeamAssessment: true,
            },
          },
        }),
      ]);
      if (teamCompleted.length == 0) {
        response.isTeamLead.hasCompleted =
          responsivenessCount.length == 0 ? false : true;
      }
    }

    return response;
  }

  async create(itemData: any, req?: any): Promise<any> {
    itemData.organizationName = req.user.organization.name;
    itemData.organizationId = req.user.organization.id;
    itemData.evaluatorId = req.user.userId;
    itemData.evaluatorName = req.user.firstName + ' ' + req.user.lastName;

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const bidRegistrationDetail = await manager
      .getRepository(BidRegistrationDetail)
      .findOne({
        where: {
          lotId: itemData.lotId,
          technicalItems: ArrayContains([itemData.itemId]),
          bidRegistration: {
            bidderId: itemData.bidderId,
          },
        },
        select: {
          id: true,
        },
      });
    if (!bidRegistrationDetail) {
      throw new NotFoundException('Bidder not found');
    }

    itemData.submit = false;

    const bidRegistrationDetailId = bidRegistrationDetail.id;
    const technicalResponsivenessAssessment = await manager
      .getRepository(TechnicalResponsivenessAssessment)
      .findOne({
        where: {
          bidRegistrationDetailId,
          isTeamAssessment: itemData.isTeamAssessment,
          itemId: itemData.itemId,
        },
      });

    if (!technicalResponsivenessAssessment) {
      const item = manager
        .getRepository(TechnicalResponsivenessAssessment)
        .create({
          bidRegistrationDetailId: bidRegistrationDetail.id,
          evaluatorId: itemData.evaluatorId,
          evaluatorName: itemData.evaluatorName,
          isTeamAssessment: itemData.isTeamAssessment,
          submit: false,
          itemId: itemData.itemId,
          // technicalResponsivenessAssessmentDetail: [itemD]
        });

      const savedItem = await manager
        .getRepository(TechnicalResponsivenessAssessment)
        .save(item);

      const itemD = manager
        .getRepository(TechnicalResponsivenessAssessmentDetail)
        .create({
          ...itemData,
          technicalResponsivenessAssessmentId: savedItem.id,
        }) as any;
      await manager
        .getRepository(TechnicalResponsivenessAssessmentDetail)
        .save(itemD);
    } else {
      const itemD = manager
        .getRepository(TechnicalResponsivenessAssessmentDetail)
        .create({
          ...itemData,
          technicalResponsivenessAssessmentId:
            technicalResponsivenessAssessment.id,
        }) as any;
      await manager
        .getRepository(TechnicalResponsivenessAssessmentDetail)
        .save(itemD);
    }

    itemData.bidRegistrationDetailId = bidRegistrationDetail.id;

    const item =
      this.technicalResponsivenessAssessmentDetailRepository.create(itemData);
    // await this.technicalResponsivenessAssessmentDetailRepository.insert(item);
    return item;
  }

  async completeBidderEvaluation(
    itemData: CompleteResponsivenessBidderEvaluationDto,
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const assessment = await manager
      .getRepository(TechnicalResponsivenessAssessment)
      .findOne({
        where: {
          bidRegistrationDetail: {
            bidRegistration: {
              bidderId: itemData.bidderId,
            },
            lotId: itemData.lotId,
            technicalItems: ArrayContains([itemData.itemId]),
          },
          itemId: itemData.itemId,
          evaluatorId: req.user.userId,
          isTeamAssessment: itemData.isTeamLead,
        },
        relations: {
          technicalResponsivenessAssessmentDetail: true,
        },
      });
    await manager.getRepository(TechnicalResponsivenessAssessment).update(
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
      await this.technicalResponsivenessAssessmentDetailRepository.find({
        where: {
          technicalResponsivenessAssessment: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
              // technicalItems: ArrayContains([itemData.itemId]),
            },
            evaluatorId: req.user.userId,
          },
        },
        relations: {
          technicalResponsivenessAssessment: true,
        },
      });
    if (checklist.length == 0) {
      throw new NotFoundException('Responsiveness evaluation not started yet');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await manager.getRepository(TechnicalResponsivenessAssessment).update(
      {
        id: In(
          checklist.map((list) => list.technicalResponsivenessAssessmentId),
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
        milestoneNum: TenderMilestoneEnum.TechnicalScoring,
        milestoneTxt: 'TechnicalScoring',
        isCurrent: true,
      });

      const technicalResponsivenessAssessment = await manager
        .getRepository(TechnicalResponsivenessAssessment)
        .find({
          where: {
            // bidderId: itemData.bidderId,
            isTeamAssessment: true,
            bidRegistrationDetail: {
              lotId: itemData.lotId,
              technicalItems: ArrayContains([itemData.itemId]),
            },
          },
        });

      const biddersComparison = technicalResponsivenessAssessment.map(
        (list) => {
          return {
            bidRegistrationDetailId: list.bidRegistrationDetailId,
            milestoneNum: TenderMilestoneEnum.TechnicalScoring,
            milestoneTxt: 'TechnicalScoring',
            bidderStatus:
              list.qualified == EvaluationStatusEnum.COMPLY ? 306 : 305,
            bidderStatusTxt:
              list.qualified == EvaluationStatusEnum.COMPLY
                ? 'TechnicalScoringSucceeded'
                : 'TechnicalScoringFailed',
            passFail:
              list.qualified == EvaluationStatusEnum.COMPLY ? true : false,
          };
        },
      );
      await manager.getRepository(BiddersComparison).insert(biddersComparison);
    }
  }

  async evaluatorReport(
    lotId: string,
    itemId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ): Promise<any> {
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [technicalResponsivenessAssessmentDetail, spdChecklist] =
      await Promise.all([
        manager.getRepository(TechnicalResponsivenessAssessmentDetail).find({
          where: {
            technicalResponsivenessAssessment: {
              bidRegistrationDetail: {
                lotId: lotId,
                technicalItems: ArrayContains([itemId]),
                bidRegistration: {
                  bidderId: bidderId,
                },
              },
              evaluatorId: req.user.userId,
              isTeamAssessment: isTeamAssessment,
              itemId,
            },
          },
          relations: {
            sorTechnicalRequirement: true,
          },
          select: {
            id: true,
            qualified: true,
            sorTechnicalRequirementId: true,
            remark: true,
            technicalResponsivenessAssessment: {
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
      check: technicalResponsivenessAssessmentDetail.find(
        (x) => x.sorTechnicalRequirementId == spdChecklist.id,
      ),
    }));
    return response;
  }

  async membersReport(
    sorTechnicalRequirementId: string,
    bidderId: string,
    lotId: string,
    itemId: string,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const report = await manager
      .getRepository(TechnicalResponsivenessAssessmentDetail)
      .find({
        where: {
          sorTechnicalRequirementId,
          technicalResponsivenessAssessment: {
            bidRegistrationDetail: {
              bidRegistration: {
                bidderId,
              },
              lotId,
            },
            itemId,
          },
        },
        relations: {
          technicalResponsivenessAssessment: true,
        },
      });
    return report;
  }
}
