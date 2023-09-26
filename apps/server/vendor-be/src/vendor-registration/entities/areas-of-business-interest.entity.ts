import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';

@Entity({ name: 'AreasOfBusinessInterestEntity' })
export class AreasOfBusinessInterestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  category: string;
  @Column()
  lineOfBusiness: string;
  @Column()
  priceRange: string;
  @Column({ name: 'vendor_id', nullable: true })
  vendorId: string;

  @ManyToOne(() => VendorsEntity, (v) => v.areasOfBusinessInterest)
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorsEntity;
}
