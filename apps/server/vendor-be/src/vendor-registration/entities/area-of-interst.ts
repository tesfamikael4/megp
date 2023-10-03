import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { VendorsBankEntity } from './vendors-bank.entity';
@Entity({ name: 'banks11' })
export class areaofEnterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  bankName: string;
  @Column({ type: 'jsonb', nullable: true })
  metaData: JSON;
  @OneToMany(() => VendorsBankEntity, (v) => v.bank)
  vendorAccounts: VendorsBankEntity[];
}
