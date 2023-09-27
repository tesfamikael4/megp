import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from '../../shared/entities/audit.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'organization_types' })
export class OrganizationType extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Organization, (organization) => organization.type, {
    cascade: true,
  })
  organizations: Organization[];
}
