import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from 'src/entities/currency.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from '../dto/currency.dto';
@Injectable()
export class CurrencyService extends EntityCrudService<Currency> {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {
    super(currencyRepository);
  }

  async createUniqueCurrency(currencyDto: CreateCurrencyDto): Promise<any> {
    const currencyExists = await this.currencyRepository.exists({
      where: {
        name: currencyDto.name,
      },
    });
    if (currencyExists) {
      throw new ConflictException({
        name: currencyDto.name,
        message: 'This Currency already exist',
      });
    } else {
      const newCurrency = await super.create(currencyDto);
      return newCurrency;
    }
  }
}
