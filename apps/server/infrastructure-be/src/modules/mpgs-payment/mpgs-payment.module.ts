import { MpgsPaymentController } from './controller/mpgs-payment.controller';
import { MpgsPaymentService } from './service/mpgs-payment.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [MpgsPaymentController],
  providers: [MpgsPaymentService],
})
export class MpgsPaymentModule {}
