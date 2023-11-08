import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UnitOfMeasurement } from './uom.entity';

@Entity({ name: 'measurements' })
export class Measurement extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  shortName: string;
  @OneToMany(() => UnitOfMeasurement, (uom1) => uom1.measurement)
  uoms: UnitOfMeasurement[];
}
