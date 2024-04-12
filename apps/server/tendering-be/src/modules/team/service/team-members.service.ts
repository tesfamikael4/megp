import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TeamMember } from 'src/entities/team-member.entity';
import { BulkTeamMemberDto } from '../dto/team-member.dto';

import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { truncate } from 'fs';
import { Tender } from 'src/entities';
import { TeamService } from './team.service';

@Injectable()
export class TeamMembersService extends ExtraCrudService<TeamMember> {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,

    private readonly teamService: TeamService,

    @Inject(REQUEST) private request: Request,
  ) {
    super(teamMemberRepository);
  }

  // * bulk create team member by teamId
  async bulkCreate(itemData: any, req?: any): Promise<any> {
    await this.teamMemberRepository.delete({
      teamId: itemData.teamId,
    });
    const members = itemData.members.map((item) => {
      item.teamId = itemData.teamId;
      item.organizationId = req.user.organization.id;
      item.organizationName = req.user.organization.name;
      return item;
    });

    const item = this.teamMemberRepository.create(members);
    await this.teamMemberRepository.insert(item);
    return item;
  }

  // ! Deprecated: bulk create team member by tenderId
  async createByTenderId(itemData: any, req?: any): Promise<any> {
    await this.teamMemberRepository.delete({
      team: {
        tenderId: itemData.tenderId,
      },
    });

    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const tender = await manager.getRepository(Tender).findOne({
      where: {
        id: itemData.tenderId,
      },
      relations: {
        lots: true,
      },
    });

    const members = itemData.members.map((item) => {
      item.teamId = itemData.teamId;
      item.organizationId = req.user.organization.id;
      item.organizationName = req.user.organization.name;
      tender.lots.forEach((element) => {
        item.lotId = element.id;
      });
      return item;
    });

    const item = this.teamMemberRepository.create(members);
    await this.teamMemberRepository.insert(item);
    return item;
  }

  // * bulk create team member with team
  async bulkCreateWithTeam(itemData: any, req?: any): Promise<any> {
    const teams = await this.teamService.create(itemData.team, req);

    const createdMembers = [];
    for (const team of teams) {
      const members = itemData.members.map((item) => {
        item.teamId = team.id;
        item.organizationId = req.user.organization.id;
        item.organizationName = req.user.organization.name;
        return item;
      });
      const createdMembersForTeam =
        await this.teamMemberRepository.create(members);
      createdMembers.push(...createdMembersForTeam);
    }

    const insertedMembers =
      await this.teamMemberRepository.insert(createdMembers);
    return insertedMembers;
  }
}
