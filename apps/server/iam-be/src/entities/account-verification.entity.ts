import { Audit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { AccountVerificationStatusEnum } from '@enums';

@Entity('account_verifications')
export class AccountVerification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  public otp: string;

  @Column({
    type: 'text',
    default: AccountVerificationStatusEnum.NEW,
    enum: AccountVerificationStatusEnum,
  })
  public status: AccountVerificationStatusEnum;

  @Column({ type: 'text' })
  public accountId: string;

  @ManyToOne(() => Account, (account) => account.accountVerifications)
  @JoinColumn({ name: 'accountId' })
  public account: Account;
}
