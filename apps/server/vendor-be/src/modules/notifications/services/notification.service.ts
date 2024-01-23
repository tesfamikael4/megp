import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { EntityCrudService } from 'src/shared/service';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { BusinessAreaEntity } from 'src/entities';
@Injectable()
export class NotificationsService extends EntityCrudService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(BusinessAreaEntity)
    private readonly businessAreaRepository: Repository<BusinessAreaEntity>,
  ) {
    super(notificationRepository);
  }

  @Cron('0 0 0 1 * *')
  async notifyExpiration(userId: string) {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    // getting services which have expire date 3 month from know
    futureDate.setMonth(currentDate.getMonth() + 3);
    const testDate = new Date('2025-01-05 14:48:58.856');
    const service = await this.businessAreaRepository.find({
      where: {
        expireDate: LessThanOrEqual(testDate),
        isrVendor: { userId: userId },
      },
      relations: { isrVendor: true },
    });
    // notifying the user will be done here when the Email/any notification mechanism is ready
    return service;
  }
}
