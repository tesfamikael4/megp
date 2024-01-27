import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Application } from './application.entity';
import { MandatePermission } from '@entities';
import { RolePermission } from '@entities';

@Entity({ name: 'permissions' })
export class Permission extends Audit {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  key: string;

  @Column()
  applicationId: number;

  @ManyToOne(() => Application, (application) => application.permissions)
  @JoinColumn({ name: 'applicationId' })
  public application: Application;

  @OneToMany(
    () => MandatePermission,
    (mandatePermissions) => mandatePermissions.permission,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  mandatePermissions: MandatePermission[];
  @OneToMany(
    () => RolePermission,
    (rolePermissions) => rolePermissions.permission,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  rolePermissions: RolePermission[];
}
