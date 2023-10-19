
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
import { Category } from 'src/categories/entities/category';

@Entity({ name: 'business_categories' })
export class BusinessCategoryEntity {
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
