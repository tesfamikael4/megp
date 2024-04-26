import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Opening } from 'src/entities/opening.entity';
import { CompleteOpeningDto, CreateOpeningDto } from '../dto/opening.dto';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { Lot, Tender } from 'src/entities';
import { TeamMember } from 'src/entities/team-member.entity';
import { MilestonesTracker } from 'src/entities/milestones-tracker.entity';
import { OpeningStatusEnum } from 'src/shared/enums/opening.enum';
import { TenderMilestone } from 'src/entities/tender-milestone.entity';
import { TenderMilestoneEnum } from 'src/shared/enums/tender-milestone.enum';

@Injectable()
export class OpeningService extends ExtraCrudService<Opening> {
  constructor(
    @InjectRepository(Opening)
    private readonly openingRepository: Repository<Opening>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(openingRepository);
  }

  async create(itemData: Opening, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }

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
      }),
    ]);
  }
}
