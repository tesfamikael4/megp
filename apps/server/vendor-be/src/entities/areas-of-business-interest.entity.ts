import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { Audit } from '@audit';
import { ServicePrice } from './service-price.entity';

@Entity({ name: 'business_interest_area' })
export class AreasOfBusinessInterestEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  category: string;
  @Column({ type: 'jsonb', default: [] })
  lineOfBusiness: string[];
  @Column({ nullable: true })
  priceRange: string;
  @Column({ nullable: true })
  vendorId: string;
  @Column({ nullable: true })
  userType: string;//Contractor, Consultant
  @Column({ nullable: true })
  classification: string;// Classification of Contractor or consultants
  @Column({ nullable: true })
  activationDate: string;
  @Column({ nullable: true })
  expiryDate: Date
  @ManyToOne(() => VendorsEntity, (v) => v.areasOfBusinessInterest)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
  @ManyToOne(() => ServicePrice, (v) => v.areasOfBusinessInterests)
  @JoinColumn({ name: 'priceRange' })
  price: ServicePrice;
}
