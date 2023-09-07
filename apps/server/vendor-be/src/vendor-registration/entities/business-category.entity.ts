import { CategoryEntity } from 'src/categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';

@Entity({ name: 'business_categories' })
export class BusinessCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;
  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.businessCategories)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
  @ManyToOne(
    () => ApplicationEntity,
    (registration) => registration.businessAreas,
  )
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;
}
