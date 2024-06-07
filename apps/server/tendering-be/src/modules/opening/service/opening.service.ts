import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Opening } from 'src/entities/opening.entity';
import { CompleteOpeningDto, CreateOpeningDto } from '../dto/opening.dto';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { BdsEvaluation, Lot, SharedBidderKey, Tender } from 'src/entities';
import { TeamMember } from 'src/entities/team-member.entity';
import { MilestonesTracker } from 'src/entities/milestones-tracker.entity';
import { OpeningStatusEnum } from 'src/shared/enums/opening.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
import { BidResponseOpeningService } from 'src/modules/bid/service';
import { DocumentTypeEnum } from 'src/shared/enums';

@Injectable()
export class OpeningService extends ExtraCrudService<Opening> {
  constructor(
    @InjectRepository(Opening)
    private readonly openingRepository: Repository<Opening>,

    private readonly bidResponseOpeningService: BidResponseOpeningService,

    @Inject(REQUEST) private request: Request,
  ) {
    super(openingRepository);
  }

  async create(itemData: Opening, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }
    //change tenderId
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const teamMember = await manager.getRepository(TeamMember).findOne({
      where: {
        team: {
          tender: itemData.tender,
        },
      },
      relations: {
        team: {
          tender: {
            bdsSubmission: true,
          },
        },
      },
    });

    itemData.teamId = teamMember.team.id;
    itemData.openingType = teamMember.team.tender.bdsSubmission.envelopType;

    const keySharedBidders = await manager.getRepository(SharedBidderKey).find({
      where: {
        bidRegistration: {
          tenderId: itemData.tenderId,
        },
      },
    });

    keySharedBidders.map(async (x) => {
      await this.bidResponseOpeningService.openBidResponse({
        tenderId: itemData.tenderId,
        bidderId: x.bidRegistration.bidderId,
        documentType: DocumentTypeEnum.RESPONSE,
        password: 'P@ssw0rd',
      });
    });
    const item = this.openingRepository.create(itemData);
    await this.openingRepository.insert(item);
    return item;
  }

  async complete(itemData: CompleteOpeningDto) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    await Promise.all([
      this.openingRepository.update(
        { tenderId: itemData.tenderId },
        {
          status: OpeningStatusEnum.COMPLETED,
        },
      ),
      manager.getRepository(TenderMilestone).insert({
        tenderId: itemData.tenderId,
        milestoneNum: TenderMilestoneEnum.TechnicalCompliance,
        milestoneTxt: 'TechnicalCompliance',
        isCurrent: true,
      }),
    ]);
  }

  async closedTender(query: CollectionQuery, req) {
    query.where.push([
      {
        column: 'organizationId',
        value: req.user.organization.id,
        operator: FilterOperators.EqualTo,
      },
    ]);

    query.where.push([
      {
        column: 'status',
        operator: FilterOperators.EqualTo,
        value: 'PUBLISHED',
      },
    ]);
    // query.where.push([
    //   {
    //     column: 'bdsSubmission.submissionDeadline',
    //     operator: FilterOperators.LessThanOrEqualTo,
    //     value: new Date(),
    //   },
    // ]);

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const dataQuery = QueryConstructor.constructQuery<Tender>(
      manager.getRepository(Tender),
      query,
    )
      .leftJoin('tenders.tenderMilestones', 'tenderMilestones')
      .andWhere('tenderMilestones.milestoneNum IN (:...milestoneNums)', {
        milestoneNums: [301, 320],
      })

      // .leftJoin('tenders.lots', 'lots')
      // .leftJoin('lots.teams', 'teams')
      .leftJoin('tenders.teams', 'teams')
      .leftJoin('teams.teamMembers', 'teamMembers')
      .andWhere('teamMembers.personnelId = :personnelId', {
        personnelId: req.user.userId,
      })
      .leftJoin('tenders.bdsSubmission', 'bdsSubmission')
      .andWhere('bdsSubmission.submissionDeadline <= :submissionDeadline', {
        submissionDeadline: new Date(),
      });
    // .andWhere('tenderMilestones.isCurrent = :isCurrent', { isCurrent: true })
    // .andWhere('tenderMilestones.milestoneNum = :milestoneNum', {
    //   milestoneNum: 303,
    // });
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

  async getTenderDetails(id: string) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id,
      },
      relations: {
        bdsEvaluation: true,
        bdsSubmission: true,
      },
      select: {
        id: true,
        name: true,
        procurementCategory: true,
        procurementReferenceNumber: true,
        status: true,
        bdsEvaluation: {
          awardType: true,
          evaluationMethod: true,
        },
        bdsSubmission: {
          envelopType: true,
        },
      },
    });
    return tender;
  }
  async getLotDetails(tenderId: string, lotId: string) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: tenderId,
        lots: {
          id: lotId,
          tenderMilestones: {
            isCurrent: true,
          },
        },
      },
      relations: {
        bdsEvaluation: true,
        bdsSubmission: true,
        lots: {
          tenderMilestones: true,
        },
      },
      select: {
        id: true,
        name: true,
        procurementCategory: true,
        procurementReferenceNumber: true,
        status: true,
        bdsEvaluation: {
          awardType: true,
          evaluationMethod: true,
        },
        bdsSubmission: {
          envelopType: true,
        },
        lots: {
          id: true,
          name: true,
          tenderMilestones: {
            milestoneNum: true,
            milestoneTxt: true,
            isCurrent: true,
          },
        },
      },
    });
    return tender;
  }
  async getBidderDetails(tenderId: string, lotId: string, bidderId: string) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: tenderId,
        lots: {
          id: lotId,
          tenderMilestones: {
            isCurrent: true,
          },
        },
        bidRegistrations: {
          bidderId: bidderId,
        },
      },
      relations: {
        bdsEvaluation: true,
        bdsSubmission: true,
        lots: {
          tenderMilestones: true,
        },
        bidRegistrations: true,
      },
      select: {
        id: true,
        name: true,
        procurementCategory: true,
        procurementReferenceNumber: true,
        status: true,
        bdsEvaluation: {
          awardType: true,
          evaluationMethod: true,
        },
        bdsSubmission: {
          envelopType: true,
        },
        lots: {
          id: true,
          name: true,
          tenderMilestones: {
            milestoneNum: true,
            milestoneTxt: true,
            isCurrent: true,
          },
        },
        bidRegistrations: {
          bidderId: true,
          bidderName: true,
        },
      },
    });
    return tender;
  }
}
