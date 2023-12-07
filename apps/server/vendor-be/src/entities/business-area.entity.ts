import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsrVendorsEntity } from './isr-vendors.entity';
import { BpServiceEntity } from './bp-service.entity';

@Entity({ name: 'business_areas' })
export class BusinessAreaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  vendorId: string;
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

  @OneToOne(() => BpServiceEntity, (vendor) => vendor.businessArea)
  @JoinColumn({ name: 'serviceId' })
  BpService: BpServiceEntity;

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
