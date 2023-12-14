import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsrVendorsEntity } from './isr-vendors.entity';
import { BpServiceEntity } from './bp-service.entity';
import { ServicePrice } from './service-price.entity';

@Entity({ name: 'business_areas' })
export class BusinessAreaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  vendorId: string;
  @Column({ type: 'uuid', nullable: true })
  priceRangeId: string;
  @Column({ type: 'uuid' })
  serviceId: string;
  @Column({ type: 'uuid' })
  instanceId: string;
  @Column()
  category: string;
  @Column({ nullable: true })
  approvedAt: Date;
  @Column({ nullable: true })
  applicationNumber: string;

  @Column({ nullable: true })
  expireDate: Date;
  @Column({ default: 'Pending' })
  status: string;
  @Column({ nullable: true })
  remark: string;
  @ManyToOne(() => IsrVendorsEntity, (vendor) => vendor.vendor)
  @JoinColumn({ name: 'vendorId' })
  isrVendor: IsrVendorsEntity;

  @ManyToOne(() => BpServiceEntity, (vendor) => vendor.businessAreas)
  @JoinColumn({ name: 'serviceId' })
  BpService: BpServiceEntity;
  @ManyToOne(() => ServicePrice, (servicePrice) => servicePrice.businessAreas)
  @JoinColumn({ name: 'priceRangeId' })
  servicePrice: ServicePrice;
  @BeforeInsert()
  setDefaultExpireYear() {
    if (this.status == 'Approved') {
      if (!this.expireDate) {
        this.expireDate = new Date();
        this.expireDate.setFullYear(this.expireDate.getFullYear() + 1);
      }
    }
  }
}
