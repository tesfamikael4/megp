import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Audit } from '../../shared/entities/audit.entity';
import { Mandate } from './mandate.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'mandate_permissions' })
export class MandatePermission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mandateId: string;

  @Column()
  permissionId: string;

  @Column()
  applicationId: string;

  @Column()
  applicationKey: string;

  @Column()
  permissionKey: string;

  @Column({ nullable: true })
  permissionName: string;

  @Column({ nullable: true })
  applicationName: string;

  @Column({ nullable: true })
  seedManPerId: string;

  @Column({ nullable: true })
  organizationId: string;

  @ManyToOne(() => Mandate, (mandate) => mandate.mandatePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'mandateId' })
  public mandate: Mandate;

  @ManyToOne(() => Permission, (permission) => permission.mandatePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'permissionId' })
  public permission: Permission;
}
