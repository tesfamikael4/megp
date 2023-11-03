import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Mandate } from './mandate.entity';
import { Organization } from '@entities';

@Entity({ name: 'organization_mandates' })
export class OrganizationMandate extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationMandates,
  )
  @ManyToOne(() => Organization, (org) => org.organizationMandates, {
    orphanedRowAction: 'delete',
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  mandateId: string;

  @ManyToOne(() => Mandate, (man) => man.organizationMandates, {
    orphanedRowAction: 'delete',
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'mandateId' })
  mandate: Mandate;
}
