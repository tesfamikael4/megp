import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessCategoryEntity } from './business-category.entity';
import { CustomCategoryEntity } from './custom-category.entity';
import { Audit } from '@audit';
@Entity({ name: 'categories' })
export class Category extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'code' })
  code: string;
  @Column({ name: 'description' })
  description: string;
  @Column() //Goods|Services|Works
  businessArea: string;
  //self reference
  @Column({ nullable: true })
  parentId: string;
  //self rererencing
  @ManyToOne(() => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @OneToMany(
    () => BusinessCategoryEntity,
    (regCategory) => regCategory.category,
  )
  businessCategories: BusinessCategoryEntity[];

  @OneToMany(
    () => CustomCategoryEntity,
    (customCategory) => customCategory.application,
  )
  customCategories: CustomCategoryEntity[];
}
