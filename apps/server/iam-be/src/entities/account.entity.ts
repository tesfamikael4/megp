import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '@audit';
import { AccountStatusEnum } from '@enums';
import { AccountVerification } from './account-verification.entity';
import { SecurityQuestion } from './security-question.entity';

@Entity('accounts')
export class Account extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: AccountStatusEnum,
    default: AccountStatusEnum.PENDING,
  })
  status: string;

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
}
