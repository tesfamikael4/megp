import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdhocTeamMember } from '@entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class AdhocTeamMemberService extends ExtraCrudService<AdhocTeamMember> {
  constructor(
    @InjectRepository(AdhocTeamMember)
    private readonly adhocTeamMemberRepository: Repository<AdhocTeamMember>,
  ) {
    super(adhocTeamMemberRepository);
  }
}
