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

@Entity({ name: 'user_roles' })
export class UserRole extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  userId: string;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  public role: Role;

  @ManyToOne(() => User, (user) => user.userRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  public user: User;
}
