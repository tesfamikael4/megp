import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { User } from '@entities';
import { Role } from './role.entity';
import { RoleSystem } from './role-system.entity';

@Entity({ name: 'user_role_systems' })
export class UserRoleSystem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleSystemId: string;

  @Column()
  userId: string;

  @ManyToOne(() => RoleSystem, (roleSystem) => roleSystem.userRoleSystems, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'roleSystemId' })
  public roleSystem: RoleSystem;

  @ManyToOne(() => User, (user) => user.userRoleSystems, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  public user: User;
}
