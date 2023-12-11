import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { RoleSystemPermission } from './role-system-permission.entity';
import { UserRoleSystem } from './user-role-system.entity';

@Entity({ name: 'role_systems' })
export class RoleSystem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  key: string;

  @OneToMany(
    () => RoleSystemPermission,
    (roleSystemPermissions) => roleSystemPermissions.roleSystem,
    {
      cascade: true,
      onDelete: 'RESTRICT',
    },
  )
  roleSystemPermissions: RoleSystemPermission[];

  @OneToMany(
    () => UserRoleSystem,
    (userRoleSystems) => userRoleSystems.roleSystem,
    {
      cascade: true,
      onDelete: 'RESTRICT',
    },
  )
  userRoleSystems: UserRoleSystem[];
}
