import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities/currency.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
@Injectable()
export class CurrencyService extends EntityCrudService<Currency> {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {
    super(currencyRepository);
  }
}
