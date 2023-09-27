import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../shared/entities/audit.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'organization_sectors' })
export class OrganizationSector extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Organization, (organization) => organization.sector, {
    cascade: true,
  })
  organizations: Organization[];
}
