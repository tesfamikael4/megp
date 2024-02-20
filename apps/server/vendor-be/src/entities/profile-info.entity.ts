import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessAreaEntity } from './business-area.entity';
import { VendorsEntity } from './vendors.entity';
import { Audit } from 'src/shared/entities';

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
