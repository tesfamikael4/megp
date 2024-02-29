import { Controller, Get } from '@nestjs/common';
import { MpgsPaymentService } from '../service/mpgs-payment.service';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from 'megp-shared-be';

@Controller('mpgs-payment')
@ApiTags('MPGS Payment')
@AllowAnonymous()
export class MpgsPaymentController {
  constructor(private readonly mpgsPaymentService: MpgsPaymentService) {}

  @Get()
  async initiatePayment() {
    return await this.mpgsPaymentService.initiatePayment();
  }
}
