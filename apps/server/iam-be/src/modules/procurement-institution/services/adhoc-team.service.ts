import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdhocTeam } from '@entities';
import { ExtraCrudService } from 'src/shared/service';
import { AdhocTeamDto } from '../dto/adhoc-team.dto';

@Injectable()
export class AdhocTeamService extends ExtraCrudService<AdhocTeam> {
  constructor(
    @InjectRepository(AdhocTeam)
    private readonly adhocTeamRepository: Repository<AdhocTeam>,
  ) {
    super(adhocTeamRepository);
  }

  async create(itemData: AdhocTeamDto, req?: any): Promise<any> {
    const name = `Adhoc Team (${itemData.startDate.getFullYear()} - ${itemData.endDate.getFullYear()})`;
    const item = this.adhocTeamRepository.create({ ...itemData, name });
    if (req?.user?.organization) {
      item.organizationId = req.user.organization.id;
    }
    await this.adhocTeamRepository.insert(item);
    return item;
  }
}
