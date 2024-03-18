import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SccPaymentTerm } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SccPaymentTermService extends ExtraCrudService<SccPaymentTerm> {
  constructor(
    @InjectRepository(SccPaymentTerm)
    private readonly sccPaymentTermRepository: Repository<SccPaymentTerm>,
  ) {
    super(sccPaymentTermRepository);
  }

  async findOne(
    tenderId: string,
    req?: any,
  ): Promise<SccPaymentTerm | undefined> {
    return await this.sccPaymentTermRepository.findOneBy({ tenderId });
  }
}
