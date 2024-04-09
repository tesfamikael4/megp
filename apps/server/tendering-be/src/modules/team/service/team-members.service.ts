import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TeamMember } from 'src/entities/team-member.entity';
import { BulkTeamMemberDto } from '../dto/team-member.dto';

@Injectable()
export class TeamMembersService extends ExtraCrudService<TeamMember> {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {
    super(teamMemberRepository);
  }
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
}
