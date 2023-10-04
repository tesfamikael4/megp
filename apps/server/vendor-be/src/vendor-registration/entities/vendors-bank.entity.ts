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
@Entity({ name: 'vendors_bank11' })
export class VendorsBankEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  vendorId: string;
  @Column({ type: 'uuid' })
  bankId: string;
  @Column({ nullable: true })
  branch: string;
  @Column({ nullable: true })
  accountName: string;
  //legal form of entity
  @Column({ nullable: true })
  accountNumber: string;
  @Column({ nullable: true })
  AccountType: string;
  @Column({ nullable: true })
  isDefualt: boolean;
  @Column({ type: 'jsonb' })
  metaData: JSON;
  @ManyToOne(() => VendorsEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;

  @ManyToOne(() => BanksEntity, (v) => v.vendorAccounts)
  @JoinColumn({ name: 'bankId' })
  bank: BanksEntity;
}
