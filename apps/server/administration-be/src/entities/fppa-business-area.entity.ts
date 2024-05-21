import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { FppaVendor } from './fppa-vendor.entity';

enum ECategory {
  GOODS = 'GOODS',
  SERVICES = 'SERVICES',
}

@Entity({ name: 'fppa_business_area' })
@Unique(['category', 'fppaVendorId'])
export class BusinessArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ECategory,
  })
  category: string;

  @Column({ default: 0 })
  from: number;

  @Column({ nullable: true })
  to: number;

  @Column()
  fppaVendorId: number;

  @ManyToOne(() => FppaVendor, (fppaVendor) => fppaVendor.businessAreas, {
    cascade: true,
  })
  @JoinColumn({ name: 'fppaVendorId' })
  fppaVendor: FppaVendor;
}
