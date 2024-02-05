export enum NotificationTypeEnum {
  EMAIL = 'EMAIL',
  MESSAGE = 'MESSAGE',
  INBOX = 'INBOX',
}

export enum NotificationStatusEnum {
  SUCCEED = 'SUCCEED',
  FAILED = 'FAILED',
}

export type SendNotificationEvent = {
  type: NotificationTypeEnum;
  application: string;
  subject: string;
  detailContent: string;
  shortContent: string;
  receiver: string;
  phoneNumber: string;
  cc: string[];
  status: NotificationStatusEnum;
  errorMessage: string;
};
