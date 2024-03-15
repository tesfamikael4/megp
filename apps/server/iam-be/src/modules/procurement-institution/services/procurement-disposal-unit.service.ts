import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProcurementDisposalUnit } from '@entities';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class ProcurementDisposalUnitService extends ExtraCrudService<ProcurementDisposalUnit> {
  constructor(
    @InjectRepository(ProcurementDisposalUnit)
    private readonly procurementDisposalUnitRepository: Repository<ProcurementDisposalUnit>,
  ) {
    super(procurementDisposalUnitRepository);
  }
}
