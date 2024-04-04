import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { PaymentInvoice } from 'src/entities/payment-invoice.entity';
import { Repository } from 'typeorm';
import {
  InitiatePaymentDto,
  PaymentCompletedDto,
} from '../dto/initiate-payment.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OfflinePaymentService {
  constructor(
    @InjectRepository(PaymentInvoice)
    private readonly paymentInvoiceRepository: Repository<PaymentInvoice>,
  ) {}

  async initiatePayment(request: InitiatePaymentDto) {
    try {
      const orderId = `ORDER-${randomUUID().replace(/-/g, '')}`;

      const invoice = this.paymentInvoiceRepository.create({
        applicationKey: request.applicationKey,
        type: 'ONLINE',
        service: request.service,
        description: request.description,
        amount: request.amount,
        currency: request.currency,
        invoiceReference: request.invoiceReference,
        orderId: orderId,
        callbackUrl: request.callbackUrl,
        status: 'PENDING',
      });

      await this.paymentInvoiceRepository.insert(invoice);

      return invoice;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentDetailByInvoiceReference(invoiceReference: string) {
    if (!invoiceReference) {
      throw new BadRequestException('invoice_reference_not_found');
    }

    const result = await this.paymentInvoiceRepository.findOneBy({
      invoiceReference: invoiceReference,
    });
    if (!result) {
      throw new BadRequestException('payment_invoice_not_found');
    }
    return result;
  }

  async paymentCompleted(payload: PaymentCompletedDto) {
    try {
      const paymentInvoice = await this.paymentInvoiceRepository.findOneBy({
        invoiceReference: payload.invoiceReference,
      });

      if (!paymentInvoice) {
        throw new BadRequestException('payment_invoice_not_found');
      }

      await this.paymentInvoiceRepository.update(paymentInvoice.id, {
        status: 'SUCCESS',
        bankReferenceNumber: payload.bankReferenceNumber,
      });

      const requestPayload = {
        status: 'SUCCESS',
        invoiceReference: paymentInvoice.invoiceReference,
      };
      await axios.post(paymentInvoice.callbackUrl, requestPayload);
    } catch (error) {
      throw error;
    }
  }
}
