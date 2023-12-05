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
import { Office } from './office.entity';
import { OrganizationMandate } from './organization-mandate.entity';
import { OrganizationType } from './organization-type.entity';
import { UnitType } from './unit-type.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({ name: 'organizations' })
export class Organization extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;
  @Column({ nullable: true })
  shortName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  order: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  budgetType: string;

  @Column('boolean', { default: false })
  isActive: boolean;

  @Column({ default: 'DRAFT' })
  status: string;

  @Column({ nullable: true, type: 'jsonb' })
  logo: any;

  @Column({ nullable: true, type: 'jsonb' })
  address: any;

  @Column({ nullable: true })
  typeId: string;

  @Column({ default: '1.0.0-alpha' })
  version: string;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ nullable: true })
  deactivateRemark: string;

  @Column({ nullable: true })
  deleteRemark: string;

  @Column({ nullable: true })
  taxIdentificationNumber: string;

  @Column({ nullable: true })
  externalOrganizationCode: string;

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
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
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

  @OneToMany(() => Office, (office) => office.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  offices: Office[];

  @OneToMany(() => Role, (roles) => roles.organization, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  roles: Role[];
}
