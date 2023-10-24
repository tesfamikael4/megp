import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'roles' })
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

  @Column({ nullable: true })
  organizationId: string;

  @OneToMany(() => RolePermission, (rolePermissions) => rolePermissions.role, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (userRoles) => userRoles.role, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  userRoles: UserRole[];
}
