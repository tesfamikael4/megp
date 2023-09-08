import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { VendorsBankEntity } from './vendors-bank.entity';
@Entity({ name: 'banks' })
export class BanksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'bank_name' })
  bankName: string;
  @Column({ name: 'meta_data', type: 'jsonb' })
  metaData: JSON;
  @OneToMany(() => VendorsBankEntity, (v) => v.bank)
  vendorAccounts: VendorsBankEntity[];
}
