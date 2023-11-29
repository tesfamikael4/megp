import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
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
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class CurrencyController extends EntityCrudController<Currency>(
  options,
) {
  constructor(private readonly currencyService: CurrencyService) {
    super(currencyService);
  }
}
