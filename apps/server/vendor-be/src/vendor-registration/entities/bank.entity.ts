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
  @Column({ nullable: true })
  bankName: string;
  @Column({ type: 'jsonb', nullable: true })
  metaData: JSON;
  @OneToMany(() => VendorsBankEntity, (v) => v.bank)
  vendorAccounts: VendorsBankEntity[];
}
