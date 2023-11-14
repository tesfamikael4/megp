import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BankAccountDetailEntity } from './bank-account-detail.entity';
@Entity({ name: 'banks' })
export class BanksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  bankName: string;
  @Column({ type: 'jsonb', nullable: true })
  metaData: JSON;
  @OneToMany(() => BankAccountDetailEntity, (v) => v.bank)
  vendorAccounts: BankAccountDetailEntity[];
}
