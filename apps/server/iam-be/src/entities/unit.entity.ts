import { Audit } from 'src/shared/entities/audit.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserUnit } from './user-unit.entity';
import { Organization } from './organization.entity';
import { UnitType } from './unit-type.entity';

@Entity({ name: 'units' })
export class Unit extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  typeId: string;

  @Column({ unique: true, nullable: true })
  code: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  parentId: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.units)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @OneToMany(() => UserUnit, (userUnits) => userUnits.unit, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userUnits: UserUnit[];

  @ManyToOne(() => UnitType, (unitType) => unitType.units, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'typeId' })
  public unitType: UnitType;
}
