import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { VendorsEntity } from './vendors.entity';
@Entity({ name: 'custom_categories' })
export class CustomCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'description' })
  description: string;
  @Column({ type: 'uuid' })
  vendorId: string;
  @ManyToOne(() => VendorsEntity, (app) => app.customCats)
  @JoinColumn({ name: 'vendorId' })
  application: VendorsEntity;
}
