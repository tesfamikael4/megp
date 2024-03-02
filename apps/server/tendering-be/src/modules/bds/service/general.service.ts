import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BdsGeneral } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class BdsGeneralService extends ExtraCrudService<BdsGeneral> {
  constructor(
    @InjectRepository(BdsGeneral)
    private readonly bdsGeneralRepository: Repository<BdsGeneral>,
  ) {
    super(bdsGeneralRepository);
  }

  async findOne(tenderId: string, req?: any): Promise<BdsGeneral | undefined> {
    return await this.bdsGeneralRepository.findOneBy({ tenderId });
  }
}
