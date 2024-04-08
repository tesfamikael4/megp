import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { Audit } from '@audit';

@Entity({ name: 'profile_info' })
export class ProfileInfoEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'jsonb' })
  profileData: any;
  @Column()
  status: string;
  @Column()
  vendorId: string;

  @ManyToOne(() => VendorsEntity, (vendorsEntity) => vendorsEntity.ProfileInfo)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
}
