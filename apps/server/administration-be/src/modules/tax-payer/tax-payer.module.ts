import { Module } from '@nestjs/common';
import { TaxPayerService } from './services/tax-payer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxPayer } from '@entities';
import { TaxPayersController } from './controllers/tax-payer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaxPayer])],
  controllers: [TaxPayersController],
  providers: [TaxPayerService],
  exports: [TaxPayerService],
})
export class TaxPayerModule {}
