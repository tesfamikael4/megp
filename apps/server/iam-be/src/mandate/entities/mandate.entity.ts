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
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { OrganizationMandate } from './organization-mandate.entity';
import { MandatePermission } from './mandate-permission.entity';

@Entity({ name: 'mandate_news' })
export class Mandate extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  key: string;

  @Column()
  isActive: boolean;

  @Column()
  versionNo: string;

  @Column()
  isSingleAssignment: boolean;

  @OneToMany(
    () => OrganizationMandate,
    (organizationMandate) => organizationMandate.mandate,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  organizationMandates: OrganizationMandate[];

  @OneToMany(
    () => MandatePermission,
    (mandatePermission) => mandatePermission.mandate,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  mandatePermissions: MandatePermission[];
}
