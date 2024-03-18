import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SccGeneralProvision } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SccGeneralProvisionService extends ExtraCrudService<SccGeneralProvision> {
  constructor(
    @InjectRepository(SccGeneralProvision)
    private readonly sccGeneralProvisionRepository: Repository<SccGeneralProvision>,
  ) {
    super(sccGeneralProvisionRepository);
  }

  async findOne(
    tenderId: string,
    req?: any,
  ): Promise<SccGeneralProvision | undefined> {
    return await this.sccGeneralProvisionRepository.findOneBy({ tenderId });
  }
}
