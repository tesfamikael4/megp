import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Account } from './account.entity';

@Entity({ name: 'security_questions' })
export class SecurityQuestion extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  accountId: string;

  @ManyToOne(() => Account, (account) => account.securityQuestions)
  @JoinColumn({ name: 'accountId' })
  public account: Account;
}
