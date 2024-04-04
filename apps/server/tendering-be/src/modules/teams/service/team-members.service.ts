import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TeamMember } from 'src/entities/team-member.entity';

@Injectable()
export class TeamMembersService extends ExtraCrudService<TeamMember> {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {
    super(teamMemberRepository);
  }
}
