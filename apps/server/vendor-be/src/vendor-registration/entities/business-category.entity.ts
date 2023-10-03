import { CategoryEntity } from 'src/categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';

@Entity({ name: 'business_categories' })
export class BusinessCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  categoryId: string;
  @Column({ type: 'uuid' })
  vendorId: string;
  @ManyToOne(() => CategoryEntity, (category) => category.businessCategories)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;
  @ManyToOne(() => VendorsEntity, (vendor) => vendor.businessCats)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
}
