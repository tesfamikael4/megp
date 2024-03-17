import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SccLiability } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SccLiabilityService extends ExtraCrudService<SccLiability> {
  constructor(
    @InjectRepository(SccLiability)
    private readonly sccLiabilityRepository: Repository<SccLiability>,
  ) {
    super(sccLiabilityRepository);
  }

  async findOne(
    tenderId: string,
    req?: any,
  ): Promise<SccLiability | undefined> {
    return await this.sccLiabilityRepository.findOneBy({ tenderId });
  }
}
