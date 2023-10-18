import { Audit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import {
  AccountVerificationStatusEnum,
  AccountVerificationTypeEnum,
} from '@enums';

@Entity('account_verifications')
export class AccountVerification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  public otp: string;

  @Column({
    type: 'enum',
    enum: AccountVerificationStatusEnum,
    default: AccountVerificationStatusEnum.NEW,
  })
  public status: string;

  @Column({
    type: 'enum',
    enum: AccountVerificationTypeEnum,
    default: AccountVerificationTypeEnum.EMAIL_VERIFICATION,
  })
  public otpType: string;

  @Column({ type: 'text' })
  public accountId: string;

  @ManyToOne(() => Account, (account) => account.accountVerifications)
  @JoinColumn({ name: 'accountId' })
  public account: Account;
}
