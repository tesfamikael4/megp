import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { ParseIntPipe } from '@nestjs/common';
import { IsrVendorsEntity } from './isr-vendors.entity';

@Entity({ name: 'business-areas' })
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
  @Column({ default: new Date() })
  approvedAt: Date;
  @Column({ default: () => "CURRENT_TIMESTAMP + INTERVAL '1 year' " })
  expireDate: Date;
  @Column({ default: 'Pending' })
  status: string;
  @Column({ nullable: true })
  remark: string;
  @ManyToOne(() => IsrVendorsEntity, (vendor) => vendor.vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: IsrVendorsEntity;

  @BeforeInsert()
  setDefaultExpireYear() {
    if (!this.expireDate) {
      this.expireDate = new Date();
      this.expireDate.setFullYear(this.expireDate.getFullYear() + 1);
    }
  }
}
