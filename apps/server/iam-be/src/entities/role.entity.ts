import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'roles' })
@Unique(['key', 'organizationId'])
export class Role extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  isSystemRole: boolean;

  @Column()
  key: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.roles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;

  @OneToMany(() => RolePermission, (rolePermissions) => rolePermissions.role, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (userRoles) => userRoles.role, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];
}
