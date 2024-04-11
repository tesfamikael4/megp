import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidOpeningChecklist } from 'src/entities/bid-opening-checklist.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Spd, SpdOpeningChecklist } from 'src/entities';
import { SubmitDto } from '../dto/bid-opening-checklist.dto';
import { TeamMember } from 'src/entities/team-member.entity';
import { BidRegistrationService } from 'src/modules/bid/service/bid-registration.service';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { BidRegistration } from 'src/entities/bid-registration.entity';

@Injectable()
export class BidOpeningChecklistService extends ExtraCrudService<BidOpeningChecklist> {
  constructor(
    @InjectRepository(BidOpeningChecklist)
    private readonly bidOpeningChecklistsRepository: Repository<BidOpeningChecklist>,

    // @InjectRepository(TeamMember)
    // private readonly teamMembersRepository: Repository<TeamMember>,

    private readonly bidSecurityService: BidRegistrationService,

    @Inject(REQUEST) private request: Request,
  ) {
    super(bidOpeningChecklistsRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationName = req.user.organization.name;
      itemData.organizationId = req.user.organization.id;
      itemData.openerId = req.user.organization.userId;
      itemData.openerId = req.user.username;
    }

    const item = this.bidOpeningChecklistsRepository.create(itemData);
    await this.bidOpeningChecklistsRepository.insert(item);
    return item;
  }

  async checklistStatus(lotId: string, bidderId: string, req: any) {
    const openerId = req.user.userId;
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
      check: checklists.find((x) => x.spdOpeningChecklistId == spdChecklist.id)
        ? true
        : false,
    }));

    return response;
  }

  async openingStatus(lotId: string, req: any) {
    // Functionality: Checks if the current user (opener) is part of the team for the given lot,
    // then checks if the opener has completed the opening checklist for each bidder.
    const openerId = req.user.userId;
    //Todo check if the opener is in the team
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const teamMember = await manager.getRepository(TeamMember).find({
      where: {
        team: {
          tender: {
            lots: {
              id: lotId,
            },
          },
        },
      },
    });
    if (!teamMember) {
      throw new NotFoundException('team not found');
    }
    if (!teamMember.find((x) => x.personnelId == openerId)) {
      throw new Error('You are not part of the team');
    }
    //Todo check if the opener has checked all the spd for that bidder

    const query = decodeCollectionQuery('');
    const bidders = await this.bidSecurityService.getSubmittedBiddersByLotId(
      lotId,
      query,
    );

    // const [spdChecklist, checklists] = await Promise.all([
    const spdChecklist = await manager.getRepository(SpdOpeningChecklist).find({
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
    });

    const response: { bidder: BidRegistration; status: string }[] = [];

    // Assuming bidders.items is an array of some kind
    for (const bidder of bidders.items) {
      const checklists = await this.bidOpeningChecklistsRepository.find({
        where: {
          lotId: lotId,
          bidderId: bidder.bidderId,
          openerId,
        },
      });
      if (spdChecklist.length === checklists.length) {
        response.push({ bidder, status: 'completed' });
      } else {
        response.push({ bidder, status: 'not completed' });
      }
    }

    return response;
  }
}
