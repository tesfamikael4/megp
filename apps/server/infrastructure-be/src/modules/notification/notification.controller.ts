import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendNotificationEvent, CurrentUser } from '@megp/shared-be';

@Controller('notification')
@ApiTags('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('send-notification')
  @ApiBody({})
  async sendNotification(@Payload() payload: SendNotificationEvent) {
    await this.notificationService.sendNotificaiton(payload);
  }

  @Get('')
  async myNotifications(@CurrentUser() user: any) {
    return await this.notificationService.getMyNotifications(user.id);
  }

  @Post('/demo')
  @ApiBody({})
  async sendDemoNotification(@Body() payload: SendNotificationEvent) {
    return await this.notificationService.demoNotification(payload);
  }
}
