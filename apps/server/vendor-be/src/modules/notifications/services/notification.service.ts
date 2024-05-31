import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { EntityCrudService } from 'src/shared/service';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BusinessAreaEntity, VendorsEntity } from 'src/entities';
import {
  CollectionQuery,
  FilterOperators,
  QueryConstructor,
} from 'src/shared/collection-query';
import { DataResponseFormat } from 'src/shared/api-data';
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
    //futureDate.setMonth(currentDate.getMonth() + 3);
    futureDate.setMinutes(currentDate.getMinutes() + 3);
    const testDate = new Date('2024-04-08 10:55:00.856');
    const service = await this.businessAreaRepository.find({
      where: {
        expireDate: LessThanOrEqual(testDate),
        isrVendor: { userId: userId },
      },
      relations: { isrVendor: true },
    });
    console.log('service expired');

    // notifying the user will be done here when the Email/any notification mechanism is ready
    return service;
  }
  //will be completed later
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendRenewalNotifications() {
    const vendors: any = await this.getBusinessAreasWithExpiringLicenses();

    for (const vendor of vendors) {
      // Send notification email
      // this.emailService.sendNotificationEmail(
      //   vendor.email,
      //   `Your license is expiring on ${vendor.licenseExpiryDate}. Please renew it.`,
      // );
      const notification: Notification = new Notification();
      notification.content = `Your license is expiring on ${vendor.expireDate}. Please renew it.`;
      notification.userId = vendor.vendor.userId;
      notification.title = 'Notification of Business Renewal';
      notification.category = "Renewal_Notification";
      this.notificationRepository.insert(notification);
      console.log(notification);
    }
  }
  async getMyNotifications(
    user: any,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<Notification>> {
    query.where.push([
      { column: 'userId', value: user.id, operator: FilterOperators.EqualTo },
    ]);
    query.orderBy.push({ column: 'createdAt', direction: 'DESC' })
    const dataQuery = QueryConstructor.constructQuery<Notification>(
      this.notificationRepository,
      query,
    );
    const [items, total] = await dataQuery.getManyAndCount();
    const response = new DataResponseFormat<Notification>();
    response.items = [...items];
    response.total = total;
    return response;
  }
  async getBusinessAreasWithExpiringLicenses(): Promise<BusinessAreaEntity[]> {
    const today = new Date();
    //notification will be resend  after 7 days
    const n = Number(process.env.RENEWAL_RENOTIFICATION_INTERVAL ?? 7);
    //for testing purpose notification will be send after 3 days
    const expiryRemainingDays = Number(process.env.EXPIRY_REMAINING_DAYS ?? 363);
    const nDaysAgo = new Date(today.getTime() - n * 24 * 60 * 60 * 1000);
    const notifiedVendors = await this.notificationRepository.createQueryBuilder('notification')
      .select('notification.userId')
      .where('(notification.category=:category AND notification.createdAt > :nDaysAgo)', { category: "Renewal_Notification", nDaysAgo: nDaysAgo })
      .getMany();
    const userIds = notifiedVendors.map(notification => notification.userId);
    const businessAreas = await this.businessAreaRepository
      .createQueryBuilder('ba')
      .innerJoinAndMapOne(
        'ba.vendor',
        VendorsEntity,
        'vendor',
        'vendor.id=ba.vendorId',
      )
      .where('extract(day from ba.expireDate -:today) <=:expiryRemainingDays AND ba.expireDate is not null AND vendor.userId NOT IN(:...notifiedVendors)',
        { today: today, expiryRemainingDays: expiryRemainingDays, notifiedVendors: [...userIds] })
      .getMany();
    return businessAreas;
  }

  async sendSubmissionNotification(
    userId: string,
    appNumber: string,
    service: string,
  ) {
    const message: Notification = new Notification();
    message.userId = userId;
    message.content = `Your Application for ${service} submitted successfully. Your application Number is ${appNumber}`;
    message.title = 'Application Submission Notification';
    this.notificationRepository.insert(message);
  }
  async sendCompletionNotification(
    userId: string,
    appNumber: string,
    service: string,
  ) {
    const message: Notification = new Notification();
    message.userId = userId;
    message.content = `Your Application for ${service} with application Number ${appNumber} have been completed successfully.`;
    message.title = 'Application Completion Notification';
    this.notificationRepository.insert(message);
  }
  async sendAdjustmentNotification(
    userId: string,
    appNumber: string,
    service: string,
  ) {
    const message: Notification = new Notification();
    message.userId = userId;
    message.content = `Your Application for ${service} returned for adjustment. Your application Number is ${appNumber}, apply correction and submit again please`;
    message.title = 'Application Adjustment Request';
    this.notificationRepository.insert(message);
  }
  async sendCancelNotification(
    userId: string,
    appNumber: string,
    service: string,
  ) {
    const message: Notification = new Notification();
    message.userId = userId;
    message.content = `We regret to inform you that your recent application for ${service} service with application Number ${appNumber} has been carefully reviewed, 
    and unfortunately, we are unable to approve it at this time. we encourage you to revisit our guidelines and consider reapplying in the future if your circumstances change or if you have made significant updates to your application.`;
    message.title = 'Application Cancelation Notification';
    this.notificationRepository.insert(message);
  }
  async sendRejectNotification(
    userId: string,
    appNumber: string,
    service: string,
  ) {
    const message: Notification = new Notification();
    message.userId = userId;
    message.content = `We regret to inform you that your recent application for ${service} service with application Number ${appNumber} has been carefully reviewed, 
    and unfortunately, we are unable to approve it at this time. we encourage you to revisit our guidelines and consider reapplying in the future if your circumstances change or if you have made significant updates to your application.`;
    message.title = 'Application Rejection Notification';
    this.notificationRepository.insert(message);
  }
  //push notification will be implemented
  //email notification will be implemented
}
