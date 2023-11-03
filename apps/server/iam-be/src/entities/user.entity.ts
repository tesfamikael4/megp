import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Organization } from '@entities';
import { UserProfile } from '@entities';
import { UserRole } from '@entities';
import { UserUnit } from '@entities';
import { ContactNumber } from 'src/shared/entities/contact-number';
import { UserGroup } from '@entities';

@Entity({ name: 'users' })
export class User extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  superTokenUserId: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ type: 'jsonb', nullable: true })
  phone: ContactNumber;

  @Column({ default: false })
  isLock: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'DRAFT' })
  status: string;

  @Column()
  organizationId: string;

  @Column({ nullable: true })
  groupId: string;

  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @OneToOne(() => UserProfile, (empProf) => empProf.user, {
    cascade: true,
  })
  userProfile: UserProfile;

  @OneToMany(() => UserRole, (userRoles) => userRoles.user, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  userRoles: UserRole[];

  @OneToMany(() => UserUnit, (userUnits) => userUnits.user, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  userUnits: UserUnit[];

  @OneToMany(() => UserGroup, (userGroups) => userGroups.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userGroups: UserGroup[];
}
