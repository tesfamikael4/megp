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
import { Audit } from 'src/shared/entities';
@Entity({ name: 'unit_of_measurements' })
export class UnitOfMeasurement extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  abbreviation: string;
  @Column()
  measurementId: string;
  @ManyToOne(() => Measurement, (uom1) => uom1.uoms)
  @JoinColumn({ name: 'measurementId' })
  measurement: Measurement;
  @OneToMany(() => ItemMaster, (entity) => entity.uom)
  itemMasters: ItemMaster[];
}
