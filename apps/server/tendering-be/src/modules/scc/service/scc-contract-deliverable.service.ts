import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SccContractDeliverable } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SccContractDeliverableService extends ExtraCrudService<SccContractDeliverable> {
  constructor(
    @InjectRepository(SccContractDeliverable)
    private readonly sccContractDeliverableRepository: Repository<SccContractDeliverable>,
  ) {
    super(sccContractDeliverableRepository);
  }
}
