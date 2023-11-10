import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  key: string;

  @Column()
  applicationId: string;

  @ManyToOne(() => Application, (application) => application.permissions)
  @JoinColumn({ name: 'applicationId' })
  public application: Application;

  @OneToMany(
    () => MandatePermission,
    (mandatePermissions) => mandatePermissions.permission,
    {
      cascade: true,
      onDelete: 'RESTRICT',
    },
  )
  mandatePermissions: MandatePermission[];
  @OneToMany(
    () => RolePermission,
    (rolePermissions) => rolePermissions.permission,
    {
      cascade: true,
      onDelete: 'RESTRICT',
    },
  )
  rolePermissions: RolePermission[];
}
