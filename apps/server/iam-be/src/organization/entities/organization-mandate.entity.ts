import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Mandate } from './mandate.entity';
import { Audit } from '../../shared/entities/audit.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'organization_mandates' })
export class OrganizationMandate extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;
  @ManyToOne(() => Organization, (org) => org.organizationMandates, {
    orphanedRowAction: 'delete',
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  mandateId: string;

  @Column({ nullable: true })
  mandateName: string;

  @ManyToOne(() => Mandate, (man) => man.organizationMandates, {
    orphanedRowAction: 'delete',
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'mandateId' })
  mandate: Mandate;

  @Column({ default: false })
  isSingleAssignment: boolean;
}
