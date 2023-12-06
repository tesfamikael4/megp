import { Module } from '@nestjs/common';
import { ProcurementThresholdService } from './services/procurement-threshold.service';
import { ProcurementThresholdsController } from './controllers/procurement-threshold.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementThreshold } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([ProcurementThreshold])],
  controllers: [ProcurementThresholdsController],
  providers: [ProcurementThresholdService],
})
export class ProcurementThresholdModule {}
