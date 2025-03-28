import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications.entity';
import { EmailService } from 'megp-shared-be';
import { Repository } from 'typeorm';
import {
  SendNotificationEvent,
  NotificationStatusEnum,
  NotificationTypeEnum,
} from 'megp-shared-be';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private readonly repositoryNotification: Repository<Notifications>,
    private readonly emailService: EmailService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  async demoNotification(data: SendNotificationEvent) {
    this.notificationClient.emit('send-notification', data);
  }
  async sendNotificaiton(data: SendNotificationEvent) {
    switch (data.type) {
      case NotificationTypeEnum.EMAIL:
        this.sendEmail(data);
        break;
      case NotificationTypeEnum.MESSAGE:
        this.sendMessage(data);
        break;
      case NotificationTypeEnum.INBOX:
        this.sendInbox(data);
        break;
    }
  }

  async getMyNotifications(userId: string) {
    return await this.repositoryNotification.find({
      where: {
        receiver: userId,
      },
    });
  }

  private async sendEmail(data: SendNotificationEvent) {
    const instance = this.repositoryNotification.create(data);
    instance.status = NotificationStatusEnum.SUCCEED;

    await this.emailService
      .sendEmail(data.receiver, data.subject, data.detailContent)
      .catch((err) => {
        instance.status = NotificationStatusEnum.FAILED;
        instance.errorMessage = err.message || null;
      });

    await this.repositoryNotification.insert(instance);
  }

  private async sendMessage(data: SendNotificationEvent) {
    const instace = this.repositoryNotification.create(data);
    await this.repositoryNotification.save(instace);
  }

  private async sendInbox(data: SendNotificationEvent) {
    const instace = this.repositoryNotification.create(data);
    await this.repositoryNotification.save(instace);
  }
}
