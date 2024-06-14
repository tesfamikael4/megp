import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Account } from './account.entity';

@Entity({ name: 'account_credentials' })
export class AccountCredential extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ unique: true })
  accountId: string;

  @OneToOne(() => Account, (account) => account.accountCredential, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
