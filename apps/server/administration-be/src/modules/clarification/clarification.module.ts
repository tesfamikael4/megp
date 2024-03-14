import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClarificationRequest } from 'src/entities/clarification-request.entity';
import { ClarificationResponse } from 'src/entities/clarification-response.entity';
import { ClarificationRequestController } from './controller/clarification-request.controller';
import { ClarificationResponseController } from './controller/clarification-response.controller';
import { ClarificationResponseService } from './service/clarification-response.service';
import { ClarificationRequestService } from './service/clarification-request.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MinIOModule } from 'src/shared/min-io/min-io.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClarificationRequest, ClarificationResponse]),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'send-notification',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MinIOModule,
  ],
  controllers: [
    ClarificationRequestController,
    ClarificationResponseController,
  ],
  providers: [ClarificationRequestService, ClarificationResponseService],
  exports: [ClarificationRequestService, ClarificationResponseService],
})
export class ClarificationModule {}
