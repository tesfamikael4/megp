import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AdhocTeam } from '@entities';
import { ExtraCrudService } from 'src/shared/service';
import { AdhocTeamChangeStatusDto, AdhocTeamDto } from '../dto/adhoc-team.dto';

@Injectable()
export class AdhocTeamService extends ExtraCrudService<AdhocTeam> {
  constructor(
    @InjectRepository(AdhocTeam)
    private readonly adhocTeamRepository: Repository<AdhocTeam>,
  ) {
    super(adhocTeamRepository);
  }

  async create(itemData: AdhocTeamDto, req?: any): Promise<any> {
    const name = `Adhoc Team (${new Date(itemData.startDate).getFullYear()} - ${new Date(itemData.endDate).getFullYear()})`;
    const item = this.adhocTeamRepository.create({ ...itemData, name });
    await this.adhocTeamRepository.insert(item);
    return item;
  }

  async changeStatus(itemData: AdhocTeamChangeStatusDto) {
    const team = await this.adhocTeamRepository.findOne({
      where: { id: itemData.id },
    });
    if (!team) {
      throw new BadRequestException('Team not found');
    }
    await this.adhocTeamRepository.update(itemData.id, {
      status: itemData.status,
    });
  }
}
