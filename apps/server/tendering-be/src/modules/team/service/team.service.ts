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

  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
      itemData.organizationName = req.user.organization.name;
    }
    const item = this.teamRepository.create(itemData);
    await this.teamRepository.insert(item);
    return item;
  }
}
