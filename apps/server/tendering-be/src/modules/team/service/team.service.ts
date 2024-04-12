import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Team } from 'src/entities/team.entity';
import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { Lot, Tender } from 'src/entities';
import { CreateTeamDto } from '../dto/team.dto';

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
    const team = await this.teamRepository.find({
      where: {
        tenderId: itemData.tenderId,
        teamType: itemData.teamType,
      },
    });
    if (team.length > 0) {
      return team;
    }
    const teams = [];
    if (
      itemData.teamType !== 'TECHNICAL_OPENER' &&
      itemData.teamType !== 'FINANCIAL_OPENER'
    ) {
      tender.lots.forEach((element) => {
        teams.push({ ...itemData, lotId: element.id });
      });
    } else {
      teams.push({ ...itemData });
    }
    const item = this.teamRepository.create(teams);
    await this.teamRepository.insert(item);
    return item;
  }

  // ! Warning: Only use this method to get random team
  async getByTenderId(tenderId: string, req: any) {
    const queryBuilder = await this.teamRepository
      .createQueryBuilder('teams')
      .distinctOn(['teams.teamType'])
      .addSelect([
        'teams.id',
        'teams.organizationId',
        'teams.organizationName',
        'teams.lotId',
        'teams.tenderId',
        'teams.envelopeType',
        'teams.memberLimit',
        'teams.tenantId',
        'teams.createdAt',
        'teams.updatedAt',
        'teams.deletedAt',
      ]) // Select other columns
      .orderBy('teams.teamType')
      .where('teams.tenderId = :tenderId', { tenderId })
      .getMany();
    return queryBuilder;
  }
}
