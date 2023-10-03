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
  @Column()
  vendorId: string;
  @Column({ type: 'uuid' })
  bankId: string;
  @Column()
  branch: string;
  @Column()
  accountName: string;
  //legal form of entity
  @Column()
  accountNumber: string;
  @Column()
  AccountType: string;
  @Column()
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
