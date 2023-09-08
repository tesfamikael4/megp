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
  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId: string;
  @ManyToOne(() => VendorsEntity, (app) => app.customCats)
  @JoinColumn({ name: 'vendor_id' })
  application: VendorsEntity;
}
