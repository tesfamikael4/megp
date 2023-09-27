import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Audit } from '../../shared/entities/audit.entity';
import { MandatePermission } from './mandate-permission.entity';
import { RolePermission } from './role-permission.entity';
import { Application } from './application.entity';

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

  @Column()
  applicationKey: string;

  @Column()
  applicationName: string;

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

  @ManyToOne(() => Application, (application) => application.permissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'applicationId' })
  public application: Application;
}
