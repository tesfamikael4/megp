import { CommonEntity } from 'src/shared/entities/common.entity';
import { BusinessCategoryEntity } from 'src/vendor-registration/entities/business-category.entity';
import { CustomCategoryEntity } from 'src/vendor-registration/entities/custom-category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ name: 'categories' })
export class Category {
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
