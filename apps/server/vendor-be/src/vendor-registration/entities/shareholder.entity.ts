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
@Entity({ name: 'shareholders' })
export class ShareholdersEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'full_name' })
  fullName: string;
  @Column({ name: 'vendor_id' })
  vendorId: string;
  @Column({ name: 'nationality', default: 'Malian' })
  nationality: string;
  @Column({ name: 'share' })
  share: string;

  @JoinColumn({ name: 'vendor_id' })
  @ManyToOne(() => VendorsEntity, (v) => v.shareholders)
  vendor: VendorsEntity;
}
