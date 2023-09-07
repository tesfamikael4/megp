import { BusinessAreaEntity } from 'src/registration-settings/entities/business-category.entity';
import { CustomCategoryEntity } from 'src/registration-settings/entities/custom-category.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
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
  @Column({ name: 'business_area' }) //Goods|Services|Works
  businessArea: string;
  //self reference
  @Column({ name: 'parent_id', nullable: true })
  parentId: string;
  //self rererencing
  @ManyToOne(() => CategoryEntity, (category) => category.childCategories)
  parentCategory: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parentCategory)
  childCategories: CategoryEntity[];

  @OneToMany(() => BusinessAreaEntity, (regCategory) => regCategory.category)
  businessCategories: BusinessAreaEntity[];

  @OneToMany(
    () => CustomCategoryEntity,
    (customCategory) => customCategory.registration,
  )
  customCategories: CustomCategoryEntity[];
}
