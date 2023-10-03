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
export class CategoryEntity extends CommonEntity {
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
  @ManyToOne(() => CategoryEntity, (category) => category.childCategories)
  parentCategory: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parentCategory)
  childCategories: CategoryEntity[];

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
