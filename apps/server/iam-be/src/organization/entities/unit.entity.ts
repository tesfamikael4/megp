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

import { Organization } from './organization.entity';

@Entity({ name: 'units' })
export class Unit extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  parentId: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.units)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;
}
