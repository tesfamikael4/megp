import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';

@Entity({ name: 'business_interest_area' })
export class AreasOfBusinessInterestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  category: string;
  @Column({ type: 'jsonb', default: [] })
  lineOfBusiness: string[];
  @Column()
  priceRange: string;
  @Column({ nullable: true })
  vendorId: string;

  @ManyToOne(() => VendorsEntity, (v) => v.areasOfBusinessInterest)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
}
