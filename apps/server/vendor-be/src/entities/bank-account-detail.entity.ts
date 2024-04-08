import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { BanksEntity } from './bank.entity';
import { Audit } from 'src/shared/entities/audit.entity';
//Vendor Service Application
@Entity({ name: 'vendors_bank' })
export class BankAccountDetailEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  accountHolderFullName: string;
  @Column()
  accountNumber: string;
  @Column({ nullable: true })
  vendorId: string;
  @Column({ type: 'uuid' })
  bankId: string;
  ///Goods , Services
  @Column({})
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
  @Column({ nullable: true })
  accountType: string;
  @Column({ nullable: true })
  isDefualt: boolean;

  @ManyToOne(() => VendorsEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
  @ManyToOne(() => BanksEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'bankId' })
  bank: BanksEntity;
}
