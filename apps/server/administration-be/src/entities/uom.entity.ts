import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Measurement } from './measurement.entity';
import { ItemMaster } from './item-master.entity';
@Entity({ name: 'unit_of_measurements' })
export class UnitOfMeasurement extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  shortName: string;
  @Column()
  code: string;
  @Column()
  measurementId: string;
  @ManyToOne(() => Measurement, (uom1) => uom1.uoms)
  @JoinColumn({ name: 'measurementId' })
  measurement: Measurement;
  @OneToMany(() => ItemMaster, (entity) => entity.uom)
  itemMasters: ItemMaster[];
}
