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
export class areaofEnterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'bank_name' })
  bankName: string;
  @Column({ name: 'meta_data', type: 'jsonb', nullable: true })
  metaData: JSON;
  @OneToMany(() => VendorsBankEntity, (v) => v.bank)
  vendorAccounts: VendorsBankEntity[];
}
