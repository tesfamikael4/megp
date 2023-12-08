import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Role } from './role.entity';
import { Permission } from '@entities';

@Entity({ name: 'role_permissions' })
@Unique(['roleId', 'permissionId'])
export class RolePermission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  permissionId: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'roleId' })
  public role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'permissionId' })
  public permission: Permission;
}
