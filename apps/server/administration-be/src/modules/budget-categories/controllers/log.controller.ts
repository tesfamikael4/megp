import { Body, Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { BudgetCategoriesService } from '../services/budget-categories.service';

@Controller('log')
export class LogController {
  constructor(private readonly categoriesService: BudgetCategoriesService) {}

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
