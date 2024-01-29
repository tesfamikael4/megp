import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications, StatusEnum } from 'src/entities/notifications.entity';
import { EmailService } from 'src/shared/email/email.service';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private readonly repositoryNotification: Repository<Notifications>,
    private readonly emailService: EmailService,
  ) {}

  async sendEmail(data: Notifications) {
    const instance = this.repositoryNotification.create(data);
    instance.status = StatusEnum.SUCCEED;

    await this.emailService
      .sendEmail(data.receiver, data.subject, data.detailContent)
      .catch((err) => {
        instance.status = StatusEnum.FAILED;
        instance.errorMessage = err.message || null;
      });

    await this.repositoryNotification.insert(instance);
  }

  async sendMessage(data: Notifications) {
    const instace = this.repositoryNotification.create(data);

    await this.repositoryNotification.save(instace);
  }

  async sendInbox(data: Notifications) {
    const instace = this.repositoryNotification.create(data);

    await this.repositoryNotification.save(instace);
  }
}
