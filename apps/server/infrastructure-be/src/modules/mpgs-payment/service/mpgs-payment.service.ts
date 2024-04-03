import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PaymentInvoice } from 'src/entities/payment-invoice.entity';
import { Repository } from 'typeorm';
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';

@Injectable()
export class MpgsPaymentService {
  constructor(
    @InjectRepository(PaymentInvoice)
    private readonly paymentInvoiceRepository: Repository<PaymentInvoice>,
  ) {}

  async initiatePayment(request: InitiatePaymentDto) {
    try {
      const orderId = `ORDER-${Date.now()}`;

      const notificationUrl =
        process.env.MPGS_PAYMENT_NOTIFICATION_URL ??
        'https://dev-bo.megp.peragosystems.com/infrastructure/api/mpgs-payments/notify';

      const payload = {
        apiOperation: 'INITIATE_CHECKOUT',
        interaction: {
          merchant: {
            name: 'The Company Co',
            url: 'https://www.merchant-site.com',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Verlagsgruppe_Random_House_Logo_2016.png',
          },
          displayControl: {
            billingAddress: 'HIDE',
            // "customerEmail": "MANDATORY"
          },
          timeout: 1800,
          timeoutUrl: 'https://www.google.com',
          cancelUrl: 'http://www.google.com',
          operation: 'PURCHASE',
        },
        order: {
          amount: request.amount,
          currency: request.currency,
          description: 'This is the order description',
          id: orderId,
          notificationUrl: notificationUrl,
        },
      };

      const auth = Buffer.from(
        process.env.MPGS_PAYMENT_USERNAME +
          ':' +
          process.env.MPGS_PAYMENT_PASSWORD,
      ).toString('base64');

      const result = await axios.post(process.env.MPGS_PAYMENT_API, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + auth,
        },
      });

      const data = await result.data;

      const invoice = this.paymentInvoiceRepository.create({
        applicationKey: request.applicationKey,
        amount: request.amount,
        currency: request.currency,
        invoiceReference: request.invoiceReference,
        sessionId: data.session.id,
        orderId: orderId,
        notificationUrl: notificationUrl,
        callbackUrl: request.callbackUrl,
        status: 'PENDING',
      });

      await this.paymentInvoiceRepository.insert(invoice);

      return {
        ...data,
        paymentLink:
          process.env.MPGS_PAYMENT_CHECKOUT_BASE_API + data.session.id,
      };
    } catch (error) {
      throw error;
    }
  }

  async paymentStatusNotification(payload: any, req: any) {
    try {
      const paymentInvoice = await this.paymentInvoiceRepository.findOneBy({
        orderId: payload.order.id,
      });
      if (!paymentInvoice) {
        throw new BadRequestException('payment_invoice_not_found');
      }

      await this.paymentInvoiceRepository.update(paymentInvoice.id, {
        status: payload.result,
      });

      const requestPayload = {
        status: payload.result,
        invoiceReference: paymentInvoice.invoiceReference,
      };
      await axios.post(paymentInvoice.callbackUrl, requestPayload);
    } catch (error) {
      throw error;
    }
  }
}
