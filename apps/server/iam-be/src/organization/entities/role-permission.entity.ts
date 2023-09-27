import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Audit } from '../../shared/entities/audit.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'role_permissions' })
export class RolePermission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  permissionId: string;

  @Column()
  permissionKey: string;

  @Column()
  permissionName: string;

  @Column()
  applicationId: string;

  @Column()
  applicationKey: string;

  @Column()
  applicationName: string;

  @Column({ nullable: true })
  seedRoleId: string;

  @Column({ nullable: true })
  seedRoleIdOrgId: string;

  @Column({ nullable: true })
  organizationId: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  public role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'permissionId' })
  public permission: Permission;
}
