import { Audit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('email_change_requests')
export class EmailChangeRequest extends Audit {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public oldEmail: string;

  @Column()
  public newEmail: string;

  @Column({
    default: 'REQUESTED',
  })
  public status: string;

  @Column()
  public accountId: string;

  @ManyToOne(() => Account, (account) => account.emailChangeRequests)
  @JoinColumn({ name: 'accountId' })
  public account: Account;
}
