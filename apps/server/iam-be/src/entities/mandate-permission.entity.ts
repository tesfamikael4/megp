import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Mandate } from './mandate.entity';
import { Permission } from '@entities';

@Entity({ name: 'mandate_permissions' })
export class MandatePermission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mandateId: string;

  @Column()
  permissionId: string;

  @ManyToOne(() => Mandate, (mandate) => mandate.mandatePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mandateId' })
  public mandate: Mandate;

  @ManyToOne(() => Permission, (permission) => permission.mandatePermissions, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  public permission: Permission;
}
