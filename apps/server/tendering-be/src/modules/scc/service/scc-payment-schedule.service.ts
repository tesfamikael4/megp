import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SccPaymentSchedule } from 'src/entities';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class SccPaymentScheduleService extends ExtraCrudService<SccPaymentSchedule> {
  constructor(
    @InjectRepository(SccPaymentSchedule)
    private readonly sccPaymentScheduleRepository: Repository<SccPaymentSchedule>,
  ) {
    super(sccPaymentScheduleRepository);
  }
}
