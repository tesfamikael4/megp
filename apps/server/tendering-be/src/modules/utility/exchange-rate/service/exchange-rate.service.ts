import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';

@Injectable()
export class ExchangeRateService extends ExtraCrudService<ExchangeRate> {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {
    super(exchangeRateRepository);
  }
}
