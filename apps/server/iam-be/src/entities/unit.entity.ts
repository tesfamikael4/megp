import { Audit } from 'src/shared/entities/audit.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserUnit } from './user-unit.entity';
import { Organization } from './organization.entity';
import { UnitType } from './unit-type.entity';
import { UnitStatus } from 'src/shared/enums';

@Entity({ name: 'units' })
@Unique(['name', 'organizationId'])
export class Unit extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  shortName: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: UnitStatus,
    default: UnitStatus.INACTIVE,
  })
  status: string;

  @Column({ nullable: true, type: 'jsonb' })
  logo: any;

  @Column({ nullable: true, type: 'jsonb' })
  address: any;

  @Column({ nullable: true })
  typeId: string;

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
