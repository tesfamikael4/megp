import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { OrganizationMandate } from './organization-mandate.entity';
import { MandatePermission } from './mandate-permission.entity';

@Entity({ name: 'mandates' })
export class Mandate extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  key: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  versionNo: string;

  @Column({ default: false })
  isSingleAssignment: boolean;

  @OneToMany(() => OrganizationMandate, (orgMandate) => orgMandate.mandate, {
    cascade: true,
  })
  organizationMandates: OrganizationMandate[];

  @OneToMany(
    () => MandatePermission,
    (mandatePermissions) => mandatePermissions.mandate,
    {
      cascade: true,
      onDelete: 'RESTRICT',
    },
  )
  mandatePermissions: MandatePermission[];
}
