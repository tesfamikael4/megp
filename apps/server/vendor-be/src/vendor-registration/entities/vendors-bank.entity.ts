import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { VendorsEntity } from './vendors.entity';
import { BanksEntity } from './bank.entity';
@Entity({ name: 'vendors_bank' })
export class VendorsBankEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'vendor_id' })
  vendorId: string;
  @Column({ name: 'bank_id', type: 'uuid' })
  bankId: string;
  @Column({ name: 'bank_branch' })
  branch: string;
  @Column({ name: 'account_name' })
  accountName: string;
  //legal form of entity
  @Column({ name: 'account_number' })
  accountNumber: string;
  @Column({ name: 'account_type' })
  AccountType: string;
  @Column({ name: 'is_default' })
  isDefualt: boolean;
  @Column({ name: 'meta_data', type: 'jsonb' })
  metaData: JSON;
  @ManyToOne(() => VendorsEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorsEntity;

  @ManyToOne(() => BanksEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'bank_id' })
  bank: BanksEntity;
}
