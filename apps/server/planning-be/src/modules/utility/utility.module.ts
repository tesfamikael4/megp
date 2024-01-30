import { Module } from '@nestjs/common';
import { QrCodeService } from './services/qr-generator.service';
import { QrCodeController } from './controllers/qr-generator.controller';
import { ReasonController } from './controllers/reason.controller';
import { ReasonService } from './services/reason.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reason } from 'src/entities/reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reason])],
  providers: [QrCodeService, ReasonService],
  controllers: [QrCodeController, ReasonController],
  exports: [],
})
export class UtilityModule {}
