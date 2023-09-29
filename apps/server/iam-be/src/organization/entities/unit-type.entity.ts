import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Unit } from './unit.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'unit_types' })
export class UnitType extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  organizationId: string;
  @ManyToOne(() => Organization, (organization) => organization.unitTypes)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @OneToMany(() => Unit, (unit) => unit.unitType, {
    cascade: true,
  })
  units: Unit[];
}
