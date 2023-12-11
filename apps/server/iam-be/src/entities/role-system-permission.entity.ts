import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Permission } from '@entities';
import { RoleSystem } from './role-system.entity';

@Entity({ name: 'role_system_permissions' })
@Unique(['roleSystemId', 'permissionId'])
export class RoleSystemPermission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleSystemId: string;

  @Column()
  permissionId: string;

  @ManyToOne(
    () => RoleSystem,
    (roleSystem) => roleSystem.roleSystemPermissions,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'roleSystemId' })
  public roleSystem: RoleSystem;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'permissionId' })
  public permission: Permission;
}
