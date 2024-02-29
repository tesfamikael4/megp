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
import { OrganizationMandate } from './organization-mandate.entity';
import { OrganizationType } from './organization-type.entity';
import { UnitType } from './unit-type.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

export enum OrganizationStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

@Entity({ name: 'organizations' })
export class Organization extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  shortName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  type: string;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    default: OrganizationStatus.INACTIVE,
  })
  status: string;

  @Column({ nullable: true, type: 'jsonb' })
  logo: any;

  @Column({ nullable: true, type: 'jsonb' })
  address: any;

  @Column({ nullable: true })
  typeId: string;

  @OneToMany(() => Unit, (unit) => unit.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  units: Unit[];

  @OneToMany(() => User, (user) => user.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: User[];

  @ManyToOne(() => OrganizationType, (type) => type.organizations, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'typeId' })
  public organizationType: OrganizationType;

  @OneToMany(
    () => OrganizationMandate,
    (orgMandate) => orgMandate.organization,
    {
      cascade: true,
    },
  )
  organizationMandates: OrganizationMandate[];

  @OneToMany(() => UnitType, (unitType) => unitType.organization, {
    cascade: true,
  })
  unitTypes: UnitType[];

  @OneToMany(() => Role, (roles) => roles.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  roles: Role[];
}
