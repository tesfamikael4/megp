import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcurementMechanism } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class ProcurementMechanismService extends ExtraCrudService<ProcurementMechanism> {
  constructor(
    @InjectRepository(ProcurementMechanism)
    private readonly procurementMechanismRepository: Repository<ProcurementMechanism>,
  ) {
    super(procurementMechanismRepository);
  }

  async findOne(
    tenderId: string,
    req?: any,
  ): Promise<ProcurementMechanism | undefined> {
    return await this.procurementMechanismRepository.findOneBy({ tenderId });
  }
}
