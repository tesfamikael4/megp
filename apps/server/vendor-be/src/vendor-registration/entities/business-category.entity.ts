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
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;
  @Column({ name: 'vendor_id', type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.businessCategories)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => VendorsEntity, (vendor) => vendor.businessCats)
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorsEntity;
}
