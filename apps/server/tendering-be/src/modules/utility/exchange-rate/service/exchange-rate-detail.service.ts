import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { ExchangeRateDetail } from 'src/entities/exchange-rate-detail.entity';

@Injectable()
export class ExchangeRateDetailService extends ExtraCrudService<ExchangeRateDetail> {
  constructor(
    @InjectRepository(ExchangeRateDetail)
    private readonly ExchangeRateDetailRepository: Repository<ExchangeRateDetail>,
  ) {
    super(ExchangeRateDetailRepository);
  }
}
