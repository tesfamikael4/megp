import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { ServicePriceEntity } from './service-price.entity';
// import { InvoiceEntity } from './invoice.entity';
// import { ServicesEntity } from './services.entity';
import { VendorsEntity } from './vendors.entity';
import { BanksEntity } from './bank.entity';
//Vendor Service Application
@Entity({ name: 'BankAccountDetail' })
export class BankAccountDetailEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'Account_holder_fullname' })
  AccountHolderFullName: string;
  @Column({ name: 'Account_number' })
  AccountNumber: string;
  @Column({ name: 'vendor_id' })
  vendorId: string;
  @Column({ name: 'bank_id', type: 'uuid' })
  bankId: string;
  ///Goods , Services
  @Column({ name: 'branch_name' })
  branchName: string;
  @Column({ name: 'branch_address' })
  branchAddress: string;
  @Column({ name: 'currency' })
  currency: string;
  @Column({ name: 'bank_swift' })
  bankSwift: string;
  @Column({ name: 'IBAN' })
  IBAN: string;
  @Column({ name: 'status' })
  status: string;
  @Column({ name: 'hash_value' })
  hashValue: string;

  @Column({ name: 'meta_data', type: 'jsonb', nullable: true })
  metaData: JSON;
  /*
  @Column({ name: 'approved_by', nullable: true, type: 'uuid' })
  approvedBy: string;
  @Column({ name: 'approved_date', nullable: true })
  approvedDate: Date;
  */

  @ManyToOne(() => VendorsEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorsEntity;

  @ManyToOne(() => BanksEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'bank_id' })
  bank: BanksEntity;
}
