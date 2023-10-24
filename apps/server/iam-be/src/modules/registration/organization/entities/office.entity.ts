import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'offices' })
export class Office extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  location: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.offices)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;
}
