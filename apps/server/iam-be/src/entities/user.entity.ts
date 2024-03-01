import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities/audit.entity';

import { Account, Organization, UserRoleSystem } from '@entities';
import { UserRole } from '@entities';
import { UserUnit } from '@entities';
import { UserGroup } from '@entities';
import { UserStatus } from 'src/shared/enums';

@Entity({ name: 'users' })
export class User extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.DRAFT,
  })
  status: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @Column({ nullable: true })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.users)
  @JoinColumn({ name: 'accountId' })
  public account: Account;

  @OneToMany(() => UserRole, (userRoles) => userRoles.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];

  @OneToMany(() => UserRoleSystem, (userRoleSystems) => userRoleSystems.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userRoleSystems: UserRoleSystem[];

  @OneToMany(() => UserUnit, (userUnits) => userUnits.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userUnits: UserUnit[];

  @OneToMany(() => UserGroup, (userGroups) => userGroups.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userGroups: UserGroup[];
}
