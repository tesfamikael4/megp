import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications.entity';
import { EmailService } from 'src/shared/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications])],
  providers: [NotificationService, EmailService],
  controllers: [NotificationController],
})
export class NotificationModule {}
