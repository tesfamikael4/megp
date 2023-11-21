import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UnitOfMeasurement } from './uom.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'measurements' })
export class Measurement extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  shortName: string;
  @OneToMany(() => UnitOfMeasurement, (uom1) => uom1.measurement)
  uoms: UnitOfMeasurement[];
}
