import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OfflinePaymentService } from '../service/offline-payment.service';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from 'megp-shared-be';
import {
  InitiatePaymentDto,
  PaymentCompletedDto,
} from '../dto/initiate-payment.dto';
import { Request } from 'express';

@Controller('offline-payments')
@ApiTags('offline Payment')
@AllowAnonymous()
export class OfflinePaymentController {
  constructor(private readonly mpgsPaymentService: OfflinePaymentService) {}

  @Get(':invoiceReference')
  async getPaymentDetailByInvoiceReference(
    @Param('invoiceReference') invoiceReference: string,
  ) {
    return await this.mpgsPaymentService.getPaymentDetailByInvoiceReference(
      invoiceReference,
    );
  }

  @Post()
  async initiatePayment(@Body() payload: InitiatePaymentDto) {
    return await this.mpgsPaymentService.initiatePayment(payload);
  }

  @Post('payment-completed')
  async paymentCompleted(@Body() payload: PaymentCompletedDto) {
    return await this.mpgsPaymentService.paymentCompleted(payload);
  }

  @Post('request/log')
  async log(@Body() payload: any) {
    console.log('🚀 ~ OfflinePaymentController ~ log ~ payload:', payload);
    return payload;
  }

  @Get('token/log')
  async tokenLog(@Body() payload: any, @Req() req: Request) {
    console.log(
      '🚀 ~ OfflinePaymentController ~ tokenLog ~ req:',
      req.headers.authorization,
    );
    console.log('🚀 ~ OfflinePaymentController ~ tokenLog ~ req:', req);
    console.log('🚀 ~ OfflinePaymentController ~ tokenLog ~ payload:', payload);

    return payload;
  }
}
