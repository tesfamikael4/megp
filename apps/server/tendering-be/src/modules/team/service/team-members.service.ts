import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TeamMember } from 'src/entities/team-member.entity';
import { BulkTeamMemberDto } from '../dto/team-member.dto';

import { REQUEST } from '@nestjs/core';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { truncate } from 'fs';
import { Tender } from 'src/entities';
import { TeamService } from './team.service';
import { Team } from 'src/entities/team.entity';

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
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const prevTeam = await manager.getRepository(Team).find({
      where: {
        ...itemData.team,
      },
    });
    const createdMembers = [];
    if (prevTeam.length == 0) {
      const teams = await this.teamService.create(itemData.team, req);
      if (!this.hasOneTeamLead(itemData.members))
        throw new Error('More than one team lead found');
      for (const team of teams) {
        const members = itemData.members.map((item) => {
          item.teamId = team.id;
          item.organizationId = req.user.organization.id;
          item.organizationName = req.user.organization.name;
          return item;
        });
        const createdMembersForTeam = this.teamMemberRepository.create(members);
        createdMembers.push(...createdMembersForTeam);
      }
    } else {
      const prevTeamIds = prevTeam.map((x) => x.id);
      await manager.getRepository(TeamMember).delete({
        teamId: In(prevTeamIds),
      });
      if (!this.hasOneTeamLead(itemData.members))
        throw new Error('More than one team lead found');
      for (const team of prevTeam) {
        const members = itemData.members.map((item) => {
          item.teamId = team.id;
          item.organizationId = req.user.organization.id;
          item.organizationName = req.user.organization.name;
          return item;
        });
        const createdMembersForTeam = this.teamMemberRepository.create(members);
        createdMembers.push(...createdMembersForTeam);
      }
    }

    await this.teamMemberRepository.insert(createdMembers);
    return createdMembers;
  }

  hasOneTeamLead(members: TeamMember[]) {
    return members.filter((x) => x.isTeamLead == true).length === 1;
  }
}
