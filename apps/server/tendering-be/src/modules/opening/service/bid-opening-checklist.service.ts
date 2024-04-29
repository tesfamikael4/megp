import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidOpeningChecklist } from 'src/entities/bid-opening-checklist.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Spd, SpdOpeningChecklist, Tender } from 'src/entities';
import {
  CompleteBidChecklistDto,
  SubmitChecklistDto,
} from '../dto/bid-opening-checklist.dto';
import { TeamMember } from 'src/entities/team-member.entity';
import { BidRegistrationService } from 'src/modules/bid/service/bid-registration.service';
import {
  CollectionQuery,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { totalmem } from 'os';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { OpeningStatusEnum } from 'src/shared/enums/opening.enum';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';

@Injectable()
export class BidOpeningChecklistService extends ExtraCrudService<BidOpeningChecklist> {
  constructor(
    @InjectRepository(BidOpeningChecklist)
    private readonly bidOpeningChecklistsRepository: Repository<BidOpeningChecklist>,

    private readonly bidRegistrationService: BidRegistrationService,

    @Inject(REQUEST) private request: Request,
  ) {
    super(bidOpeningChecklistsRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationName = req.user.organization.name;
      itemData.organizationId = req.user.organization.id;
      itemData.openerId = req.user.userId;
      itemData.openerName = req.user.firstName + ' ' + req.user.lastName;
    }

    itemData.submit = false;

    const item = this.bidOpeningChecklistsRepository.create(itemData);
    await this.bidOpeningChecklistsRepository.insert(item);
    return item;
  }

  async submit(itemData: SubmitChecklistDto, req?: any): Promise<any> {
    const checklist = await this.bidOpeningChecklistsRepository.find({
      where: {
        tenderId: itemData.tenderId,
        openerId: req.user.userId,
      },
    });
    if (checklist.length == 0) {
      throw new NotFoundException('Bid Opening Checklist not found');
    }

    await this.bidOpeningChecklistsRepository.update(
      {
        tenderId: itemData.tenderId,
        openerId: req.user.userId,
        isTeamLead: itemData.isTeamLead,
      },
      {
        submit: true,
      },
    );
  }

  async checklistStatus(
    lotId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ) {
    const openerId = req.user.userId;
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [spdChecklist, checklists] = await Promise.all([
      manager.getRepository(SpdOpeningChecklist).find({
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
      this.bidOpeningChecklistsRepository.find({
        where: {
          lotId,
          bidderId,
          openerId,
        },
      }),
    ]);
    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: checklists.find(
        (x) =>
          x.spdOpeningChecklistId == spdChecklist.id &&
          x.isTeamLead == isTeamAssessment,
      )
        ? true
        : false,
    }));
    return response;
  }

  async biddersStatus(
    lotId: string,
    isTeam: string,
    query: CollectionQuery,
    req: any,
  ) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the opening checklist for each bidder.
    const openerId = req.user.userId;
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;
    //Todo check if the opener is in the team
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const teamMember = await manager.getRepository(TeamMember).exists({
      where: {
        team: {
          tender: {
            lots: {
              id: lotId,
            },
          },
          teamMembers: {
            personnelId: openerId,
          },
        },
      },
    });

    // if (teamMember) {
    //   throw new Error('You are not part of the team');
    // }
    //Todo check if the opener has checked all the spd for that bidder

    const [bidders, spdChecklist] = await Promise.all([
      this.bidRegistrationService.getSubmittedBiddersByLotId(lotId, query),

      manager.getRepository(SpdOpeningChecklist).find({
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
      total: bidders.total,
    };

    const checklists = await this.bidOpeningChecklistsRepository.find({
      where: {
        lotId: lotId,
        bidderId: In(bidders.items.map((bidder) => bidder.bidderId)),
        openerId,
      },
    });

    for (const bidder of bidders.items) {
      if (
        spdChecklist.length ===
        checklists.filter(
          (x) =>
            x.bidderId == bidder.bidderId && x.isTeamLead == isTeamAssessment,
        ).length
      ) {
        response.items.push({ bidder, status: 'completed' });
      } else if (
        checklists.filter(
          (x) =>
            x.bidderId == bidder.bidderId && x.isTeamLead == isTeamAssessment,
        ).length == 0
      ) {
        response.items.push({ bidder, status: 'not started' });
      } else {
        response.items.push({ bidder, status: 'in progress' });
      }
    }

    return response;
  }

  async complete(itemData: CompleteBidChecklistDto) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    await this.bidOpeningChecklistsRepository.update(
      { tenderId: itemData.tenderId },
      {
        submit: true,
      },
    );
  }

  async canComplete(
    tenderId: string,
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
    const openerId = req.user.userId;
    const [isTeamLead, openingChecklist, canTeam] = await Promise.all([
      manager.getRepository(TeamMember).exists({
        where: {
          team: {
            tender: {
              id: tenderId,
            },
          },
          personnelId: openerId,
          isTeamLead: true,
        },
      }),
      manager.getRepository(BidOpeningChecklist).exists({
        where: {
          tenderId,
          openerId,
          submit: false,
        },
      }),
      manager.getRepository(BidOpeningChecklist).exists({
        where: {
          tenderId,
          submit: false,
        },
      }),
    ]);
    response.isTeamLead.isTeam = isTeamLead;
    response.hasCompleted = !openingChecklist;
    response.canTeamAssess = !canTeam;

    if (isTeamLead) {
      const teamCompleted = await this.bidOpeningChecklistsRepository.find({
        where: {
          tenderId,
          openerId,
          isTeamLead: true,
          submit: false,
        },
      });
      if (teamCompleted.length > 0) {
        response.isTeamLead.hasCompleted = false;
      }
    }

    return response;
  }

  async membersReport(
    spdOpeningChecklistId: string,
    bidderId: string,
    lotId: string,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const report = await manager.getRepository(BidOpeningChecklist).find({
      where: {
        spdOpeningChecklistId: spdOpeningChecklistId,
        bidderId: bidderId,
        lotId: lotId,
      },
    });
    return report;
  }

  async openingMinutes(tenderId: string) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: tenderId,
        // lots: {
        //   teams: {
        //     teamType: TeamRoleEnum.FINANCIAL_OPENER
        //   },
        // }
      },
      relations: {
        lots: {
          bidOpeningCheckLists: true,
          teams: {
            teamMembers: true,
          },
          bidRegistrationDetails: {
            bidRegistration: true,
          },
        },
        spd: {
          spd: true,
        },
      },
    });
    return tender;
  }
}
