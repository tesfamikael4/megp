import { Body, Controller, Get, Req, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RabbitMqErrorService } from '../services/rabbit-mq-error.service';
import { EventPattern } from '@nestjs/microservices';
import { Request } from 'express';

@Controller('rabbit-mq')
@ApiTags('RabbitMQ')
export class RabbitMqErrorController {
  constructor(private readonly rabbitMqErrorService: RabbitMqErrorService) {}

  // @UseFilters(RabbitMQExceptionFilter)
  @EventPattern('rabbit-mq-error')
  async tenderApproval(@Body() data: any) {
    return await this.rabbitMqErrorService.log(data);
  }

  @Get('token')
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
}
