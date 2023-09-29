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

import { Organization } from './organization.entity';
import { SecurityQuestion } from './security-question.entity';
import { UserProfile } from './user-profile.entity';
import { UserRole } from './user-role.entity';
import { UserUnit } from './user-unit.entity';
import { ContactNumber } from 'src/shared/entities/contact-number';

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

  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @OneToMany(
    () => SecurityQuestion,
    (securityQuestion) => securityQuestion.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  securityQuestions: SecurityQuestion[];
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
}
