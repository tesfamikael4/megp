import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ name: 'user_roles' })
export class UserRole extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  userId: string;

  @Column()
  roleName: string;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  public role: Role;

  @ManyToOne(() => User, (user) => user.userRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  public user: User;
}
