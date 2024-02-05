import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailModule } from '@megp/shared-be';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications]),
    EmailModule,
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
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
