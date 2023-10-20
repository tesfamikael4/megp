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

@Entity({ name: 'uoms' })
export class UOM extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Measurement, (entity) => entity.id)
  @JoinColumn({
    name: 'measurementId',
  })
  measurementId: string;

  measurement: Measurement;

  @Column()
  name: string;
  @Column()
  shortName: string;
  @Column()
  code: string;

  @OneToMany(() => ItemMaster, (entity) => entity.uOM)
  itemMasters: ItemMaster[];
}
