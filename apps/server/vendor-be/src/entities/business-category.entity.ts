import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { Category } from './category.entity';
import { Audit } from '@audit';
@Entity({ name: 'business_categories' })
export class BusinessCategoryEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  categoryId: string;
  @Column({ type: 'uuid' })
  vendorId: string;
  @ManyToOne(() => Category, (category) => category.businessCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
  @ManyToOne(() => VendorsEntity, (vendor) => vendor.businessCats)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
}
