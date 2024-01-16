import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-generator.service';
import { QrCodeController } from './qr-generator.controller';

@Module({
  imports: [],
  providers: [QrCodeService],
  controllers: [QrCodeController],
  exports: [],
})
export class QRModule {}
