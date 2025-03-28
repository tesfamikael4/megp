import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from '@audit';
import { AccountStatusEnum } from '@enums';
import { AccountVerification } from './account-verification.entity';
import { SecurityQuestion } from './security-question.entity';
import { User } from './user.entity';
import { AccountProfile } from './account-profile.entity';
import { EmailChangeRequest } from './email-change-request.entity';
import { AccountCredential } from './account-credential.entity';

@Entity('accounts')
export class Account extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', nullable: true, unique: true })
  email: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: AccountStatusEnum,
    default: AccountStatusEnum.PENDING,
  })
  status: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: 0 })
  failedAttempts: number;

  @Column({ nullable: true })
  bannedUntil: Date;

  @OneToMany(
    () => AccountVerification,
    (accountVerification) => accountVerification.account,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  accountVerifications: AccountVerification[];

  @OneToMany(
    () => SecurityQuestion,
    (securityQuestion) => securityQuestion.account,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  securityQuestions: SecurityQuestion[];

  @OneToMany(() => User, (user) => user.account, {
    onDelete: 'CASCADE',
  })
  users: User[];

  @OneToMany(
    () => EmailChangeRequest,
    (emailChangeRequest) => emailChangeRequest.account,
    {
      onDelete: 'CASCADE',
    },
  )
  emailChangeRequests: EmailChangeRequest[];

  @OneToOne(() => AccountProfile, (accountProfile) => accountProfile.account, {
    cascade: true,
  })
  userProfile: AccountProfile;

  @OneToOne(
    () => AccountCredential,
    (accountCredential) => accountCredential.account,
    {
      cascade: true,
    },
  )
  accountCredential: AccountCredential;
}
