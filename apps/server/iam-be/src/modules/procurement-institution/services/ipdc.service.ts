import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IPDC } from '@entities';
import { ExtraCrudService } from 'src/shared/service';
import { IPDCDto, IPDCTeamChangeStatusDto } from '../dto/ipdc.dto';

@Injectable()
export class IPDCService extends ExtraCrudService<IPDC> {
  constructor(
    @InjectRepository(IPDC)
    private readonly iPDCRepository: Repository<IPDC>,
  ) {
    super(iPDCRepository);
  }
  async create(itemData: IPDCDto, req?: any): Promise<any> {
    const name = `IPDC (${new Date(itemData.startDate).getFullYear()} - ${new Date(itemData.endDate).getFullYear()})`;
    const item = this.iPDCRepository.create({ ...itemData, name: name });
    await this.iPDCRepository.insert(item);
    return item;
  }

  async changeStatus(itemData: IPDCTeamChangeStatusDto) {
    const team = await this.iPDCRepository.findOne({
      where: { id: itemData.id },
    });
    if (!team) {
      throw new BadRequestException('Team not found');
    }
    const prevActive = await this.iPDCRepository.find({
      where: { status: 'ACTIVE' },
    });
    prevActive.map((team) => {
      this.iPDCRepository.update(team.id, { status: 'INACTIVE' });
    });
    await this.iPDCRepository.update(itemData.id, { status: itemData.status });
  }
}
