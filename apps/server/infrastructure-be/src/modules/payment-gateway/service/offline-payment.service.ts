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
import { PaymentInvoiceStatusEnum } from 'src/shared/enums/payment-invoice-status.enum';

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
        type: 'OFFLINE',
        service: request.service,
        description: request.description,
        amount: request.amount,
        currency: request.currency,
        invoiceReference: request.invoiceReference,
        orderId: orderId,
        callbackUrl: request.callbackUrl,
        status: PaymentInvoiceStatusEnum.PENDING,
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

    if (invoiceReference == 'TI-0001') {
      throw new BadRequestException('payment_invoice_not_found');
    } else if (invoiceReference == 'TI-0002') {
      throw new BadRequestException('payment_invoice_paid');
    } else if (invoiceReference == 'TI-0003') {
      const result = await this.paymentInvoiceRepository.findOneBy({
        invoiceReference: invoiceReference,
      });

      return result;
    }

    const result = await this.paymentInvoiceRepository.findOneBy({
      invoiceReference: invoiceReference,
    });
    if (!result) {
      throw new BadRequestException('payment_invoice_not_found');
    } else if (result.status == PaymentInvoiceStatusEnum.SUCCESS) {
      throw new BadRequestException('payment_invoice_paid');
    } else if (result.status == PaymentInvoiceStatusEnum.FAILED) {
      throw new BadRequestException('payment_invoice_failed_request_new');
    }
    return result;
  }

  async paymentCompleted(payload: PaymentCompletedDto) {
    try {
      if (payload.invoiceReference == 'TI-0001') {
        throw new BadRequestException('payment_invoice_not_found');
      } else if (payload.invoiceReference == 'TI-0002') {
        throw new BadRequestException('payment_invoice_paid');
      } else if (payload.invoiceReference == 'TI-0003') {
        const paymentInvoice = await this.paymentInvoiceRepository.findOneBy({
          invoiceReference: payload.invoiceReference,
        });

        const status = payload.status ?? PaymentInvoiceStatusEnum.SUCCESS;

        await this.paymentInvoiceRepository.update(paymentInvoice.id, {
          status: status,
          bankReferenceNumber: payload.bankReferenceNumber,
        });

        return {
          ...paymentInvoice,
          status,
        };
      }
      const paymentInvoice = await this.paymentInvoiceRepository.findOneBy({
        invoiceReference: payload.invoiceReference,
      });

      if (!paymentInvoice) {
        throw new BadRequestException('payment_invoice_not_found');
      }

      const status = payload.status ?? PaymentInvoiceStatusEnum.SUCCESS;

      await this.paymentInvoiceRepository.update(paymentInvoice.id, {
        status: status,
        bankReferenceNumber: payload.bankReferenceNumber,
      });

      const requestPayload = {
        status: status,
        invoiceReference: paymentInvoice.invoiceReference,
      };
      await axios.post(paymentInvoice.callbackUrl, requestPayload);
    } catch (error) {
      throw error;
    }
  }
}
