import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsPreparation } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsPreparationService extends ExtraCrudService<BdsPreparation> {
  constructor(
    @InjectRepository(BdsPreparation)
    private readonly bdsPreparationRepository: Repository<BdsPreparation>,
  ) {
    super(bdsPreparationRepository);
  }

  async findOne(
    tenderId: string,
    req?: any,
  ): Promise<BdsPreparation | undefined> {
    return await this.bdsPreparationRepository.findOneBy({ tenderId });
  }

  async update(id: string, itemData: any) {
    const item = await this.bdsPreparationRepository.findOneBy({
      tenderId: id,
    });
    await this.bdsPreparationRepository.update(item.id, itemData);
    return {
      ...item,
      ...itemData,
    };
  }
}
