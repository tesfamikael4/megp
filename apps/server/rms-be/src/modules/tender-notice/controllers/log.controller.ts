import { Body, Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { TenderNoticeService } from '../services/tender-notice.service';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from 'megp-shared-be';

@Controller('log')
@ApiTags('Log')
export class LogController {
  constructor(private readonly categoriesService: TenderNoticeService) {}

  @Get('token')
  @AllowAnonymous()
  async tokenLog(@Body() payload: any, @Req() req: Request) {
    console.log(
      '🚀 ~ OfflinePaymentController ~ authorization ~ authorization:',
      req.headers.authorization,
    );
    console.log(
      '🚀 ~ OfflinePaymentController ~ tokenLog ~ headers:',
      req.headers,
    );

    return '<h2>Token Log</h2>';
  }
}
