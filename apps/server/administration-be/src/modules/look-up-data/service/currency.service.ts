import { Injectable } from '@nestjs/common';
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
  async createUniqueData(
    currencyDto: CreateCurrencyDto,
  ): Promise<any> {
    const NameExist = await this.currencyRepository.findOne({
      where: {
        name: currencyDto.name,
        abbreviation: currencyDto.abbreviation,
      },
      withDeleted: true,
    });
    if (NameExist) {
      // If the existing Currency is soft-deleted, recover it
      if (NameExist.deletedAt) {
        await this.currencyRepository.recover(NameExist);
        // Update abbreviation and description (if needed) and return the recovered Currency
        NameExist.abbreviation = currencyDto.abbreviation;
        NameExist.description = currencyDto.description;
        await this.currencyRepository.save(NameExist);
        return NameExist;
      } else {
        // If the Currency is not soft-deleted, return a message indicating the name exists
        return {
          name: currencyDto.name,
          message: 'Currency already exist.'
        };
      }
    } else {
      // If no Currency with the same name exists, create a new one
      const newCurrency = new Currency();
      newCurrency.name = currencyDto.name;
      newCurrency.description = currencyDto.description;
      newCurrency.abbreviation = currencyDto.abbreviation;
      try {
        const result = await this.currencyRepository.save(newCurrency);
        if (result) {
          return result;
        }
      } catch (error) {
        throw error;
      }
    }
  }
}
