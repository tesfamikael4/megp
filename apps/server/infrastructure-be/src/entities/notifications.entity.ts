import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import {
  NotificationTypeEnum,
  NotificationStatusEnum,
} from 'src/shared/types/notification.type';

@Entity({ name: 'notifications' })
export class Notifications extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationTypeEnum,
  })
  type: NotificationTypeEnum;

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

  @Column({ type: 'simple-array', nullable: true })
  cc: string[];

  @Column({
    type: 'enum',
    enum: NotificationStatusEnum,
  })
  status: NotificationStatusEnum;

  @Column({ nullable: true })
  errorMessage: string;
}
