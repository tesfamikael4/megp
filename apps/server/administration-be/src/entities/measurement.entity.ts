import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemCategory } from './item-category.entity';
import { UnitOfMeasurement } from './uom.entity';

@Entity({ name: 'measurements' })
export class Measurement extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  shortName: string;
  @Column()
  code: string;
  @OneToMany(() => UnitOfMeasurement, (uom1) => uom1.measurement)
  uoms: UnitOfMeasurement[];
  @OneToOne(() => ItemCategory, (icategory) => icategory.measurement)
  itemCategory: ItemCategory;
}
