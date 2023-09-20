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
  @Column({ name: 'Account_holder_fullname', nullable: true })
  AccountHolderFullName: string;
  @Column({ name: 'Account_number', nullable: true })
  AccountNumber: string;
  @Column({ name: 'vendor_id', nullable: true })
  vendorId: string;
  @Column({ name: 'bank_id', type: 'uuid', nullable: true })
  bankId: string;
  ///Goods , Services
  @Column({ name: 'branch_name', nullable: true })
  branchName: string;
  @Column({ name: 'branch_address', nullable: true })
  branchAddress: string;
  @Column({ name: 'currency', nullable: true })
  currency: string;
  @Column({ name: 'bank_swift', nullable: true })
  bankSwift: string;
  @Column({ name: 'IBAN', nullable: true })
  IBAN: string;
  @Column({ name: 'status', nullable: true })
  status: string;
  @Column({ name: 'hash_value', nullable: true })
  hashValue: string;
  @Column({ name: 'bankName', nullable: true })
  bankName: string;
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
