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
import { Category } from './category.entity';

@Entity({ name: 'business-areas' })
export class BusinessAreaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  vendorId: string;
  @Column({ type: 'uuid' })
  categoryId: string;
  @Column({ default: new Date() })
  approvedAt: Date;
  @Column({ default: () => `CURRENT_TIMESTAMP + INTERVAL '1 year'` })
  expireDate: Date;
  @Column({ default: 'Active' })
  status: string;
  @ManyToOne(() => Category, (category) => category.businessCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
  @ManyToOne(() => VendorsEntity, (vendor) => vendor.businessCats)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;

  @BeforeInsert()
  setDefaultExpireYear() {
    if (!this.expireDate) {
      this.expireDate = new Date();
      this.expireDate.setFullYear(this.expireDate.getFullYear() + 1);
    }
  }
}
