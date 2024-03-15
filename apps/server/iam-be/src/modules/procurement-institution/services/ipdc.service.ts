import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IPDC } from '@entities';
import { ExtraCrudService } from 'src/shared/service';
import { IPDCDto } from '../dto/ipdc.dto';

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
    if (req?.user?.organization) {
      item.organizationId = req.user.organization.id;
    }
    await this.iPDCRepository.insert(item);
    return item;
  }
}
