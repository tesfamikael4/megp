import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsAward } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsAwardService extends ExtraCrudService<BdsAward> {
  constructor(
    @InjectRepository(BdsAward)
    private readonly bdsAwardRepository: Repository<BdsAward>,
  ) {
    super(bdsAwardRepository);
  }

  async findOne(tenderId: string, req?: any): Promise<BdsAward | undefined> {
    return await this.bdsAwardRepository.findOneBy({ tenderId });
  }

  async update(id: string, itemData: any) {
    const item = await this.bdsAwardRepository.findOneBy({ tenderId: id });
    await this.bdsAwardRepository.update(item.id, itemData);
    return {
      ...item,
      ...itemData,
    };
  }
}
