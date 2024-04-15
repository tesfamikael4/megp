import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { Currency } from 'src/entities/currency.entity';
import { CurrencyService } from '../service/currency.service';
import { CreateCurrencyDto, UpdateCurrencyDto } from '../dto/currency.dto';
const options: EntityCrudOptions = {
  createDto: CreateCurrencyDto,
  updateDto: UpdateCurrencyDto,
};
@Controller('currencies')
@ApiTags(' currency')
export class CurrencyController extends EntityCrudController<Currency>(
  options,
) {
  constructor(private readonly currencyService: CurrencyService) {
    super(currencyService);
  }
  @Post()
  async createUniqueData(@Body() UoMDto: CreateCurrencyDto) {
    return await this.currencyService.createUniqueCurrency(UoMDto);
  }
}
