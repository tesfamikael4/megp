import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BankAccountDetailEntity } from './bank-account-detail.entity';
import { Audit } from 'src/shared/entities';
@Entity({ name: 'banks' })
export class BanksEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  bankName: string;
  @Column({ type: 'jsonb', nullable: true })
  metaData: JSON;
  @OneToMany(() => BankAccountDetailEntity, (v) => v.bank)
  vendorAccounts: BankAccountDetailEntity[];
}
