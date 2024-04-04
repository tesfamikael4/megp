import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { Team } from 'src/entities/team.entity';

@Injectable()
export class TeamService extends ExtraCrudService<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {
    super(teamRepository);
  }
}
