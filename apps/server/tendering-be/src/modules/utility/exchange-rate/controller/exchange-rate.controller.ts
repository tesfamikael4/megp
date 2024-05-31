import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExchangeRateService } from '../service/exchange-rate.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  //   createDto: CreatePreliminaryAssessment,
};

@Controller('exchange-rate')
@ApiTags('Exchange rate  Controller')
export class ExchangeRateController extends ExtraCrudController<ExchangeRate>(
  options,
) {
  constructor(private readonly exchangeRateService: ExchangeRateService) {
    super(exchangeRateService);
  }
}
