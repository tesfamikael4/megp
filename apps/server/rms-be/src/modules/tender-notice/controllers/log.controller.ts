import { Body, Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { TenderNoticeService } from '../services/tender-notice.service';

@Controller('log')
export class LogController {
  constructor(private readonly categoriesService: TenderNoticeService) {}

  @Get('token')
  async tokenLog(@Body() payload: any, @Req() req: Request) {
    console.log(
      '🚀 ~ OfflinePaymentController ~ authorization ~ req:',
      req.headers.authorization,
    );
    console.log('🚀 ~ OfflinePaymentController ~ tokenLog ~ req:', req);
    console.log('🚀 ~ OfflinePaymentController ~ log ~ payload:', payload);
    return payload;
  }
}
