import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Audit } from 'src/shared/entities/audit.entity';

import { Mandate } from './mandate.entity';
import { Organization } from "src/organization/entities/organization.entity";


@Entity({ name: "organization_mandates" })
export class OrganizationMandate extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.organizationMandates)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @Column()
  mandateId: string;

  @ManyToOne(() => Mandate, (mandate) => mandate.organizationMandates)
  @JoinColumn({ name: 'mandateId' })
  public mandate: Mandate;

}