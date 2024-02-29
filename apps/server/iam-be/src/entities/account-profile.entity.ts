import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Account } from './account.entity';

@Entity({ name: 'user_profiles' })
export class AccountProfile extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  extendedProfile: any;

  @Column()
  accountId: string;

  @OneToOne(() => Account, (emp) => emp.userProfile, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
