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
  OpenerResultDto,
  SubmitChecklistDto,
} from '../dto/bid-opening-checklist.dto';
import { TeamMember } from 'src/entities/team-member.entity';
import { BidRegistrationService } from 'src/modules/bid/service/bid-registration.service';
import {
  CollectionQuery,
  decodeCollectionQuery,
} from 'src/shared/collection-query';
import { BidRegistration } from 'src/entities/bid-registration.entity';
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
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const bidder = await manager.getRepository(BidRegistration).findOne({
      where: {
        bidderId: itemData.bidderId,
        bidRegistrationDetails: {
          lotId: itemData.lotId,
        },
      },
      select: {
        bidderName: true,
      },
    });
    itemData.bidderName = bidder.bidderName;
    itemData.submit = false;
    itemData.complete = false;

    const item = this.bidOpeningChecklistsRepository.create(itemData);
    await this.bidOpeningChecklistsRepository.insert(item);
    return item;
  }

  async complete(itemData: CompleteBidChecklistDto, req?: any): Promise<any> {
    const checklist = await this.bidOpeningChecklistsRepository.find({
      where: {
        tenderId: itemData.tenderId,
        openerId: req.user.userId,
        bidderId: itemData.bidderId,
        isTeamLead: itemData.isTeamLead,
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

  async submit(itemData: SubmitChecklistDto, req?: any): Promise<any> {
    const checklist = await this.bidOpeningChecklistsRepository.find({
      where: {
        tenderId: itemData.tenderId,
        openerId: req.user.userId,
        isTeamLead: itemData.isTeamLead,
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
            tenderSpds: {
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
            tenderSpds: {
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

  // async complete(itemData: CompleteBidChecklistDto) {
  //   const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
  //   await this.bidOpeningChecklistsRepository.update(
  //     { tenderId: itemData.tenderId },
  //     {
  //       submit: true,
  //     },
  //   );
  // }

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
    const [isTeamLead, openingChecklist, checklist, teamMembers] =
      await Promise.all([
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
            isTeamLead: false,
            submit: false,
          },
        }),
        manager.getRepository(BidOpeningChecklist).find({
          where: {
            tenderId,
          },
        }),
        manager.getRepository(TeamMember).find({
          where: {
            team: {
              tender: {
                id: tenderId,
              },
              teamType: TeamRoleEnum.FINANCIAL_OPENER,
            },
          },
        }),
      ]);
    response.isTeamLead.isTeam = isTeamLead;
    response.hasCompleted = !openingChecklist;
    response.canTeamAssess = true;

    const openersSet = new Set(
      checklist.reduce((acc, item) => {
        return item.openerId ? acc.concat(item.openerId) : acc;
      }, []),
    );

    for (const teamMember of teamMembers) {
      if (openersSet.has(teamMember.personnelId)) {
        // If team member is an opener
        if (
          checklist.some(
            (x) =>
              x.openerId === teamMember.personnelId &&
              !x.submit &&
              x.isTeamLead == false,
          )
        ) {
          response.canTeamAssess = false; // If any item is not submitted, team can't assess
          break; // Exit the loop since the assessment decision is made
        }
      } else {
        response.canTeamAssess = false; // If team member is not an opener, team can't assess
        break; // Exit the loop since the assessment decision is made
      }
    }

    if (isTeamLead) {
      const teamCompleted = await this.bidOpeningChecklistsRepository.find({
        where: {
          tenderId,
          openerId,
          isTeamLead: true,
          submit: false,
        },
      });
      if (teamCompleted.length == 0) {
        response.isTeamLead.hasCompleted = true;
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

  async openingMinutes(tenderId: string): Promise<{
    tender: {
      id: any;
      name: any;
      procurementReferenceNumber: any;
      submissionDeadline: any;
      openingDate: any;
    };
    spdOpeningChecklists: any;
    bidders: any[];
    lots: any[];
  }> {
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
        bdsSubmission: true,
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
          spd: {
            spdOpeningChecklists: true,
          },
        },
      },
    });

    const response = {
      tender: {
        id: tender.id,
        name: tender.name,
        procurementReferenceNumber: tender.procurementReferenceNumber,
        submissionDeadline: tender.bdsSubmission.submissionDeadline,
        openingDate: tender.bdsSubmission.openingDate,
      },
      spdOpeningChecklists: tender.spd.spd.spdOpeningChecklists,
      bidders: [],
      lots: [],
    };

    for (const lot of tender.lots) {
      response.lots.push({
        id: lot.id,
        name: lot.name,
        tenderId: lot.tenderId,
      });
      for (const bidder of lot.bidRegistrationDetails) {
        response.bidders.push(bidder.bidRegistration);
      }
    }
    return response;
  }

  // returns the list of spd checklist and remark given by the opener
  async openerReport(
    lotId: string,
    bidderId: string,
    isTeam: string,
    req: any,
  ): Promise<any> {
    const isTeamAssessment = isTeam == 'teamLeader' ? true : false;

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [bidOpeningCheckLists, spdChecklist] = await Promise.all([
      manager.getRepository(BidOpeningChecklist).find({
        where: {
          lotId: lotId,
          bidderId: bidderId,
          openerId: req.user.userId,
        },
        select: {
          id: true,
          spdOpeningChecklistId: true,
          isTeamLead: true,
          checked: true,
          remark: true,
        },
      }),

      manager.getRepository(SpdOpeningChecklist).find({
        where: {
          spd: {
            tenderSpds: {
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

    const response = spdChecklist.map((spdChecklist) => ({
      ...spdChecklist,
      check: bidOpeningCheckLists.find(
        (x) =>
          x.spdOpeningChecklistId == spdChecklist.id &&
          x.isTeamLead == isTeamAssessment,
      ),
    }));
    return response;
  }
}
