import { TypeOrmModule } from '@nestjs/typeorm';
import { MpgsPaymentController } from './controller/mpgs-payment.controller';
import { MpgsPaymentService } from './service/mpgs-payment.service';
import { Module } from '@nestjs/common';
import { PaymentInvoice } from 'src/entities/payment-invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentInvoice])],
  controllers: [MpgsPaymentController],
  providers: [MpgsPaymentService],
})
export class MpgsPaymentModule {}
