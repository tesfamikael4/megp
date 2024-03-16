import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { TenderParticipationFee } from 'src/entities/tender-participation-fee.entity';

@Injectable()
export class TenderParticipationFeeService extends ExtraCrudService<TenderParticipationFee> {
  constructor(
    @InjectRepository(TenderParticipationFee)
    private readonly spdContractFormRepository: Repository<TenderParticipationFee>,
  ) {
    super(spdContractFormRepository);
  }
}
