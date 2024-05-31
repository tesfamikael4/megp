import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateController } from './controller/exchange-rate.controller';
import { ExchangeRateDetailController } from './controller/exchange-rate-detail.controller';
import { ExchangeRateService } from './service/exchange-rate.service';
import { ExchangeRateDetailService } from './service/exchange-rate-detail.service';
import { ExchangeRate } from 'src/entities/exchange-rate.entity';
import { ExchangeRateDetail } from 'src/entities/exchange-rate-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate, ExchangeRateDetail])],
  providers: [ExchangeRateService, ExchangeRateDetailService],
  controllers: [ExchangeRateController, ExchangeRateDetailController],
})
export class ExchangeRateModule {}
