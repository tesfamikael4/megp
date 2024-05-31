import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ArrayContains,
  EntityManager,
  In,
  JsonContains,
  Not,
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
import { CompleteScoringBidderEvaluationDto } from '../dto/technical-preliminary-assessment.dto';
import { TechnicalScoringAssessment } from 'src/entities/technical-scoring-assessments.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { BidderStatusEnum } from 'src/shared/enums/bidder-status.enum';
import { DataResponseFormat } from 'src/shared/api-data';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';

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
  async passedBidders(lotId: string, query: CollectionQuery, req: any) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the spd compliance for each bidder.
    //Todo check if the opener is in the team
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const evaluatorId = req.user.userId;

    const [passed, eqcChecklist] = await Promise.all([
      manager.getRepository(BiddersComparison).find({
        where: {
          bidRegistrationDetail: {
            lotId: lotId,
          },
          milestoneNum: 305,
          bidderStatus: 308,
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
            .bidderId == bidder.bidRegistrationDetail.bidRegistration.bidderId,
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
            bidder.bidRegistrationDetail.bidRegistration.bidderId,
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
            bidder.bidRegistrationDetail.bidRegistration.bidderId,
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

  async checklistStatus(lotId: string, bidderId: string, req: any) {
    const evaluatorId = req.user.userId;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const entities = await manager.getRepository(EqcTechnicalScoring).find({
      where: {
        lotId,
        parentId: null,
      },
    });
    const root = entities.find((entry) => entry.parentId === null);
    const [eqcChecklist, checklists] = await Promise.all([
      manager.getTreeRepository(EqcTechnicalScoring).findDescendantsTree(root),
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

    // Helper function to construct the tree structure
    function buildTree(
      entries: EqcTechnicalScoring[],
      parentId: string | null = null,
    ) {
      return entries
        .filter((entry) => entry.parentId === parentId)
        .map((entry) => ({
          ...entry,
          check: checklists.some((x) => x.eqcTechnicalScoringId === entry.id),
          awardedPoints: checklists.find(
            (x) => x.eqcTechnicalScoringId === entry.id,
          )?.pointsAwarded,
          children: buildTree(entries, entry.id),
        }));
    }

    // Identify root entries and construct the tree
    const rootEntries = buildTree(entities, null);
    const response = await this.traverseAndMap(rootEntries[0], checklists);

    // return this.groupChecklist(response);
    return response;
  }

  async traverseAndMap(
    treeNode: EqcTechnicalScoring,
    checklists: any,
  ): Promise<any> {
    const tree = {
      ...treeNode,
      // check: checklists.some((x) => x.eqcTechnicalScoringId === treeNode.id),
      check:
        checklists &&
        checklists.find((x) => x.eqcTechnicalScoringId == treeNode.id)
          ? true
          : false,
      children: treeNode.children
        ? await Promise.all(
            treeNode.children.map((child) =>
              this.traverseAndMap(child, checklists),
            ),
          )
        : [],
    };
    return tree;
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
        },
      });

    const eqcTechnicalScoring = await manager
      .getRepository(EqcTechnicalScoring)
      .findOne({
        where: {
          id: itemData.eqcTechnicalScoringId,
        },
      });
    // const eqcTechnicalScoringParents = await manager.getTreeRepository(EqcTechnicalScoring).findAncestorsTree(eqcTechnicalScoring)

    // const eqcTechnicalScoringTree = await manager.getTreeRepository(EqcTechnicalScoring).findAncestorsTree(eqcTechnicalScoring);

    const ancestors = await this.findAncestors(manager, itemData);

    if (itemData.pointsAwarded > eqcTechnicalScoring.point) {
      throw new HttpException('Points Awarded Exceeds Maximum Points', 430);
    }

    itemData.maxPoints = eqcTechnicalScoring.point;

    let technicalScoringAssessmentId;
    if (!technicalScoringAssessment) {
      const newAssessment = manager
        .getRepository(TechnicalScoringAssessment)
        .create({
          bidRegistrationDetailId,
          evaluatorId: req.user.userId,
          evaluatorName: itemData.evaluatorName,
          submit: false,
          totalPoints: +itemData.pointsAwarded,
        });

      const savedAssessment = await manager
        .getRepository(TechnicalScoringAssessment)
        .save(newAssessment);
      technicalScoringAssessmentId = savedAssessment.id;
    } else {
      technicalScoringAssessmentId = technicalScoringAssessment.id;
    }

    const saveDetailTree = async (
      treeNode: EqcTechnicalScoring,
      parentId: string | null = null,
      pointsAwarded: number,
      child: EqcTechnicalScoring,
    ) => {
      const parent = await manager
        .getRepository(TechnicalScoringAssessmentDetail)
        .findOne({
          where: {
            eqcTechnicalScoringId: treeNode.id,
          },
        });
      if (parent && !child) {
        await manager.getRepository(TechnicalScoringAssessmentDetail).update(
          {
            eqcTechnicalScoringId: treeNode.id,
          },
          {
            pointsAwarded: pointsAwarded,
          },
        );
      } else if (parent) {
        await manager.getRepository(TechnicalScoringAssessmentDetail).update(
          {
            eqcTechnicalScoringId: treeNode.id,
          },
          {
            pointsAwarded: +parent.pointsAwarded + +pointsAwarded,
          },
        );
        parentId = parent.id;
      } else {
        const newDetail = manager
          .getRepository(TechnicalScoringAssessmentDetail)
          .create({
            ...itemData,
            eqcTechnicalScoringId: treeNode.id,
            pointsAwarded: pointsAwarded, // Adjust this based on your logic
            maxPoints: treeNode.point,
            technicalScoringAssessmentId,
            parentId,
          });

        const savedDetail = (await manager
          .getRepository(TechnicalScoringAssessmentDetail)
          .save(newDetail)) as any;
        parentId = savedDetail.id;
      }
      if (child) {
        // for (const child of treeNode.children) {
        await saveDetailTree(
          child,
          parentId,
          pointsAwarded,
          ancestors.find((x) => x.parentId == child.id) as any,
        );
        // }
      }
    };
    const root = ancestors.find((x) => x.parentId == null);
    const child = ancestors.find((x) => x.parentId == root.id);

    await saveDetailTree(root, null, itemData.pointsAwarded, child);

    return manager
      .getRepository(TechnicalScoringAssessmentDetail)
      .findOne({ where: { id: technicalScoringAssessmentId } });
  }

  private async findAncestors(manager: EntityManager, itemData: any) {
    const entities = await manager.getRepository(EqcTechnicalScoring).find({
      where: {
        lotId: itemData.lotId,
      },
      relations: {
        children: true,
      },
    });

    const entityMap = new Map();
    entities.forEach((entity) => {
      entityMap.set(entity.id, entity);
    });

    const eqcTechnicalScoring = entityMap.get(itemData.eqcTechnicalScoringId);

    if (!eqcTechnicalScoring) {
      throw new Error('Target entity not found');
    }

    // Initialize an array to store the ancestors
    const ancestors = [];
    ancestors.push(eqcTechnicalScoring);

    // Traverse the hierarchy upwards to find all ancestors
    let currentEntity = eqcTechnicalScoring;
    while (currentEntity && currentEntity.parentId) {
      const parentEntity = entityMap.get(currentEntity.parentId);
      if (parentEntity) {
        ancestors.push(parentEntity);
        currentEntity = parentEntity;
      } else {
        break; // If the parent entity is not found, break the loop
      }
    }
    return ancestors;
  }

  async completeBidderEvaluation(
    itemData: CompleteScoringBidderEvaluationDto,
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const assessment = await manager
      .getRepository(TechnicalScoringAssessmentDetail)
      .find({
        where: {
          technicalScoringAssessment: {
            bidRegistrationDetail: {
              bidRegistration: {
                bidderId: itemData.bidderId,
              },
              lotId: itemData.lotId,
            },
            evaluatorId: req.user.userId,
          },
        },
      });
    const root = assessment.find((x) => x.parentId == null);
    await manager.getRepository(TechnicalScoringAssessment).update(
      {
        id: root.technicalScoringAssessmentId,
      },
      {
        totalPoints: root.pointsAwarded,
      },
    );
  }

  async submit(itemData: any, req?: any): Promise<any> {
    const checklist =
      await this.technicalScoringAssessmentDetailRepository.find({
        where: {
          technicalScoringAssessment: {
            bidRegistrationDetail: {
              lotId: itemData.lotId,
              // technicalItems: ArrayContains([itemData.itemId]),
            },
            evaluatorId: req.user.userId,
          },
        },
        relations: {
          technicalScoringAssessment: true,
        },
      });
    if (checklist.length == 0) {
      throw new NotFoundException('Scoring evaluation not started yet');
    }

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const assessments = await manager
      .getRepository(TechnicalScoringAssessment)
      .exists({
        where: {
          bidRegistrationDetail: {
            lotId: itemData.lotId,
            // technicalItems: ArrayContains([itemData.itemId]),
          },
          submit: false,
          evaluatorId: Not(req.user.userId),
        },
      });

    const assessmentCount = await manager
      .getRepository(TechnicalScoringAssessment)
      .count({
        where: {
          bidRegistrationDetail: {
            lotId: itemData.lotId,
            // technicalItems: ArrayContains([itemData.itemId]),
          },
        },
      });

    const members = await manager.getRepository(TeamMember).count({
      where: {
        team: {
          lotId: itemData.lotId,
          teamType: TeamRoleEnum.TECHNICAL_EVALUATOR,
        },
      },
    });

    await manager.getRepository(TechnicalScoringAssessment).update(
      {
        id: In(checklist.map((list) => list.technicalScoringAssessmentId)),
      },
      {
        submit: true,
      },
    );

    if (!assessments && members == assessmentCount) {
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
        milestoneNum: TenderMilestoneEnum.FinancialCompliance,
        milestoneTxt: 'FinancialCompliance',
        isCurrent: true,
      });

      const technicalScoringAssessment = await manager
        .getRepository(TechnicalScoringAssessment)
        .find({
          where: {
            // bidderId: itemData.bidderId,
            bidRegistrationDetail: {
              lotId: itemData.lotId,
            },
          },
        });

      const biddersComparison = technicalScoringAssessment.map((list) => {
        return {
          bidRegistrationDetailId: list.bidRegistrationDetailId,
          milestoneNum: TenderMilestoneEnum.TechnicalScoring,
          milestoneTxt: 'TechnicalScoring',
          bidderStatus: list.totalPoints >= 70 ? 310 : 309,
          bidderStatusTxt:
            list.totalPoints >= 70
              ? 'TechnicalScoringSucceeded'
              : 'TechnicalScoringFailed',
          passFail: list.totalPoints >= 70 ? true : false,
        };
      });
      await manager.getRepository(BiddersComparison).insert(biddersComparison);
    }
  }

  async evaluatorReport(
    lotId: string,
    itemId: string,
    bidderId: string,
    req: any,
  ): Promise<any> {
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
