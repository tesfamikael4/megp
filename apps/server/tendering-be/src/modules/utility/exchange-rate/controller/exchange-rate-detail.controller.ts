import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExchangeRateDetail } from 'src/entities/exchange-rate-detail.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExchangeRateDetailService } from '../service/exchange-rate-detail.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  //   createDto: CreatePreliminaryAssessment,
};

@Controller('exchange-rate')
@ApiTags('Exchange rate  Controller')
export class ExchangeRateDetailController extends ExtraCrudController<ExchangeRateDetail>(
  options,
) {
  constructor(
    private readonly exchangeRateDetailService: ExchangeRateDetailService,
  ) {
    super(exchangeRateDetailService);
  }
}
