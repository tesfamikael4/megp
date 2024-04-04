import { TypeOrmModule } from '@nestjs/typeorm';
import { MpgsPaymentController } from './controller/mpgs-payment.controller';
import { MpgsPaymentService } from './service/mpgs-payment.service';
import { Module } from '@nestjs/common';
import { PaymentInvoice } from 'src/entities/payment-invoice.entity';
import { OfflinePaymentController } from './controller/offline-payment.controller';
import { OfflinePaymentService } from './service/offline-payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentInvoice])],
  controllers: [MpgsPaymentController, OfflinePaymentController],
  providers: [MpgsPaymentService, OfflinePaymentService],
})
export class PaymentGatewayModule {}
