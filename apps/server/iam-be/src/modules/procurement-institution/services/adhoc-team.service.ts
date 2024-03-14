import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdhocTeam } from '@entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class AdhocTeamService extends ExtraCrudService<AdhocTeam> {
  constructor(
    @InjectRepository(AdhocTeam)
    private readonly adhocTeamRepository: Repository<AdhocTeam>,
  ) {
    super(adhocTeamRepository);
  }
}
