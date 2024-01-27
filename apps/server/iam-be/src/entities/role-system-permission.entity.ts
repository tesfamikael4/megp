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
  roleSystemId: number;

  @Column()
  permissionId: number;

  @ManyToOne(
    () => RoleSystem,
    (roleSystem) => roleSystem.roleSystemPermissions,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'roleSystemId' })
  public roleSystem: RoleSystem;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  public permission: Permission;
}
