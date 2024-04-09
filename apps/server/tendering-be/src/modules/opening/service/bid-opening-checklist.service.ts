import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { BidOpeningChecklist } from 'src/entities/bid-opening-checklist.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { EntityManager } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Spd, SpdOpeningChecklist } from 'src/entities';

@Injectable()
export class BidOpeningChecklistService extends ExtraCrudService<BidOpeningChecklist> {
  constructor(
    @InjectRepository(BidOpeningChecklist)
    private readonly bidOpeningChecklistsRepository: Repository<BidOpeningChecklist>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(bidOpeningChecklistsRepository);
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

  // async
}
