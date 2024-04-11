import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Team } from 'src/entities/team.entity';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { Lot, Tender } from 'src/entities';

@Injectable()
export class TeamService extends ExtraCrudService<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @Inject(REQUEST) private request: Request,
  ) {
    super(teamRepository);
  }

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: itemData.tenderId,
      },
      relations: {
        lots: true,
      },
    });
    if (!tender) {
      throw new NotFoundException('Tender not found');
    }
    const teams = [];
    tender.lots.forEach((element) => {
      teams.push({ ...itemData, lotId: element.id });
    });
    const item = this.teamRepository.create(teams);
    await this.teamRepository.insert(item);
    return item;
  }
}
