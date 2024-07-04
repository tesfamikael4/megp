import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MpgsPaymentService } from '../service/mpgs-payment.service';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, ApiKeyGuard } from 'megp-shared-be';
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';

@Controller('mpgs-payments')
@ApiTags('mpgs Payment')
@AllowAnonymous()
export class MpgsPaymentController {
  constructor(private readonly mpgsPaymentService: MpgsPaymentService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  async initiatePayment(@Body() payload: InitiatePaymentDto) {
    return await this.mpgsPaymentService.initiatePayment(payload);
  }
  @Post('notify')
  async paymentStatusNotification(@Body() payload: any, @Req() req: any) {
    return await this.mpgsPaymentService.paymentStatusNotification(
      payload,
      req,
    );
  }
}
