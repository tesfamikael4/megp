import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PaymentInvoice } from 'src/entities/payment-invoice.entity';
import { Repository } from 'typeorm';
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';
import { randomUUID } from 'crypto';
import { PaymentInvoiceStatusEnum } from 'src/shared/enums/payment-invoice-status.enum';

@Injectable()
export class MpgsPaymentService {
  constructor(
    @InjectRepository(PaymentInvoice)
    private readonly paymentInvoiceRepository: Repository<PaymentInvoice>,
  ) {}

  async initiatePayment(request: InitiatePaymentDto) {
    try {
      const orderId = `ORDER-${randomUUID().replace(/-/g, '')}`;

      const notificationUrl =
        process.env.MPGS_PAYMENT_NOTIFICATION_URL ??
        'https://dev-bo.megp.peragosystems.com/infrastructure/api/mpgs-payments/notify';

      const returnUrl =
        process.env.MPGS_PAYMENT_RETURN_URL ??
        'https://dev.megp.peragosystems.com';

      const payload = {
        apiOperation: 'INITIATE_CHECKOUT',
        interaction: {
          merchant: {
            name: 'M-EGP',
            url: 'https://maneps.mw',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Verlagsgruppe_Random_House_Logo_2016.png',
          },
          displayControl: {
            billingAddress: 'HIDE',
            // "customerEmail": "MANDATORY"
          },
          timeout: 1800,
          timeoutUrl: `${returnUrl}`,
          cancelUrl: `${returnUrl}`,
          redirectMerchantUrl: `${returnUrl}`,
          returnUrl: `${returnUrl}/my-workspace`,
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
        type: 'ONLINE',
        service: request.service,
        description: request.description,
        amount: request.amount,
        currency: request.currency,
        invoiceReference: request.invoiceReference,
        sessionId: data.session.id,
        orderId: orderId,
        notificationUrl: notificationUrl,
        callbackUrl: request.callbackUrl,
        status: PaymentInvoiceStatusEnum.PENDING,
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
