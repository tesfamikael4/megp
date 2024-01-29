import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('send-notification')
  async sendNotification(@Payload() payload: any) {
    await this.notificationService.sendEmail(payload);
  }

  @EventPattern('send-message')
  async sendMessage(@Payload() payload: any) {
    await this.notificationService.sendMessage(payload);
  }

  @EventPattern('send-inbox')
  async sendInbox(@Payload() payload: any) {
    await this.notificationService.sendInbox(payload);
  }
}
