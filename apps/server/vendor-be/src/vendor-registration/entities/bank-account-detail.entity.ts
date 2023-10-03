import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { ServicePriceEntity } from './service-price.entity';
// import { InvoiceEntity } from './invoice.entity';
// import { ServicesEntity } from './services.entity';
import { VendorsEntity } from './vendors.entity';
import { BanksEntity } from './bank.entity';
//Vendor Service Application
@Entity({ name: 'vendor_bank' })
export class BankAccountDetailEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  accountHolderFullName: string;
  @Column({ nullable: true })
  accountNumber: string;
  @Column({ nullable: true })
  vendorId: string;
  @Column({ type: 'uuid', nullable: true })
  bankId: string;
  ///Goods , Services
  @Column({ nullable: true })
  branchName: string;
  @Column({ nullable: true })
  branchAddress: string;
  @Column({ nullable: true })
  currency: string;
  @Column({ nullable: true })
  bankSwift: string;
  @Column({ nullable: true })
  IBAN: string;
  @Column({ nullable: true })
  status: string;
  @Column({ nullable: true })
  hashValue: string;
  @Column({ nullable: true })
  bankName: string;
  @Column({ type: 'jsonb', nullable: true })
  metaData: JSON;
  /*
  @Column({ name: 'approved_by', nullable: true, type: 'uuid' })
  approvedBy: string;
  @Column({ name: 'approved_date', nullable: true })
  approvedDate: Date;
  */
  @ManyToOne(() => VendorsEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
  @ManyToOne(() => BanksEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'bankId' })
  bank: BanksEntity;
}
