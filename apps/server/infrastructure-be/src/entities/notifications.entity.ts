import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrgAudit } from 'src/shared/entities';

enum NotificationEnum {
  EMAIL = 'EMAIL',
  MESSAGE = 'MESSAGE',
  INBOX = 'INBOX',
}
export enum StatusEnum {
  SUCCEED = 'SUCCEED',
  FAILED = 'FAILED',
}

@Entity({ name: 'notifications' })
export class Notifications extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationEnum,
  })
  type: NotificationEnum;

  @Column()
  application: string;

  @Column()
  subject: string;

  @Column()
  detailContent: string;

  @Column()
  shortContent: string;

  // @Column()
  // sender: string

  @Column()
  receiver: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'simple-array' })
  cc: string[];

  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @Column({ nullable: true })
  errorMessage: string;
}
