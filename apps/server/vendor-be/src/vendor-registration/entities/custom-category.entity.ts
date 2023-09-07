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
@Entity({ name: 'custom_categories' })
export class CustomCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'description' })
  description: string;
  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;
  @ManyToOne(() => ApplicationEntity, (app) => app.customCats)
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;
}
