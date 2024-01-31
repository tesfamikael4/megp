import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendNotificationEvent } from '../../shared/types/notification.type';
import { CurrentUser } from 'src/shared/authorization';

@Controller('notification')
@ApiTags('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('send-notification')
  async sendNotification(@Payload() payload: SendNotificationEvent) {
    await this.notificationService.sendNotificaiton(payload);
  }

  @Get('')
  async myNotifications(@CurrentUser() user: any) {
    return await this.notificationService.getMyNotifications(user.id);
  }
}
