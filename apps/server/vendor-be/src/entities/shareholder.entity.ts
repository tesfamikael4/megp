import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { Audit } from '@audit';
@Entity({ name: 'shareholders' })
export class ShareholdersEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  firstname: string;
  @Column({ nullable: true })
  lastName: string;

  @Column({ default: 'Malian' })
  nationality: string;
  @Column({ nullable: true })
  share: string;

  @ManyToOne(() => VendorsEntity, (v) => v.shareholders)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
}
