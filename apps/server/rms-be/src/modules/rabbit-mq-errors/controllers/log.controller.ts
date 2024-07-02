import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from 'megp-shared-be';

@Controller('log')
@ApiTags('Log')
export class LogController {
  @Get('token')
  @AllowAnonymous()
  async tokenLog(@Req() req: Request) {
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

  @Post('complete')
  @AllowAnonymous()
  async logComplete(@Body() payload: any, @Req() req: Request) {
    console.log('🚀 ~ LogController ~ logComplete ~ payload:', payload);
    console.log(
      '🚀 ~ OfflinePaymentController ~ authorization ~ authorization:',
      req.headers.authorization,
    );

    return '<h2>Token Log</h2>';
  }
}
