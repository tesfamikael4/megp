import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { RoleSystemPermission } from './role-system-permission.entity';
import { UserRoleSystem } from './user-role-system.entity';

@Entity({ name: 'role_systems' })
export class RoleSystem extends Audit {
  @PrimaryColumn()
  id: number;

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
      onDelete: 'CASCADE',
    },
  )
  roleSystemPermissions: RoleSystemPermission[];

  @OneToMany(
    () => UserRoleSystem,
    (userRoleSystems) => userRoleSystems.roleSystem,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  userRoleSystems: UserRoleSystem[];
}
